import express from "express";
import cors from "cors";
import axios, { formToJSON } from "axios";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "./utils/authMiddleWare.js";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
const app = express();
const prisma = new PrismaClient();
const PORT = 3000;
dotenv.config();

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true,
  })
);

const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const APPLICATION_ID = process.env.APPLICATION_ID;

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Google Cloud Storage with the specified key file for authentication
const storage = new Storage({
  keyFilename: "./key.json",
});

// Define the name of the Google Cloud Storage bucket where files will be uploaded
const bucketName = "plane-scape-bucket";

// User registration endpoint
app.post("/api/register", upload.single("photo"), async (req, res) => {
  // GET user register info from body
  const { email, name, password } = await req.body;
  let photoUrl = null;

  try {
    // Check if a user already exists with the provided email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // If a user with this email already exists, respond with an error
    if (existingUser) {
      return res.status(400).json({ error: "Email taken" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    if (req.file) {
      // Create a reference to the blob in the specified bucket using the original file name
      const blob = storage.bucket(bucketName).file(req.file.originalname);
      const blobStream = blob.createWriteStream({ resumable: false });

      // Use a Promise to handle the blob stream's events
      await new Promise((resolve, reject) => {
        blobStream.on("error", (err) => {
          console.error("Blob stream error:", err);
          reject(err);
        });

        blobStream.on("finish", () => {
          // Construct the public URL of the uploaded photo upon successful upload
          photoUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
          resolve();
        });
        blobStream.end(req.file.buffer); // End the stream with the file buffer
      });
    } else {
      return res.status(400).json({ error: "Photo is required" });
    }

    // Create a new user in the db
    const user = await prisma.user.create({
      data: {
        email,
        firstName: name,
        password: hashedPassword,
        photoUrl,
        createdAt: new Date(),
      },
    });
    // Respond user information
    res.json(user);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

// User login endpoint
app.post("/api/login", async (req, res) => {
  // GET user email, password from body
  const { email, password } = req.body;

  // Email or password required
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    // User not available
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // Hash password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password does not match, respond with an error
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // Generate an access token that expires in 10 minutes
    const accessToken = jwt.sign(
      { userId: user.id, userRole: user.role },
      ACCESS_SECRET_TOKEN,
      {
        expiresIn: "10m",
      }
    );
    // Generate an refresh token that expires in 10 minutes
    const refreshToken = jwt.sign(
      { userId: user.id, userRole: user.role },
      REFRESH_SECRET_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    // Set the access token in a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });
    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });

    // Respond with a success message and user information
    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Fetch flight data from an external API
app.get("/api/flights", authMiddleware(), async (req, res) => {
  try {
    const response = await axios.get(BASE_URL, {
      // Set the headers required for the external API
      // Include the API key, app id for authentication
      headers: {
        Accept: "application/json",
        app_id: APPLICATION_ID,
        app_key: API_KEY,
        ResourceVersion: "v4",
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

// Get user reservations
app.get("/api/user/reservation", authMiddleware(), async (req, res) => {
  // GET user id from payload
  const { userId } = req.tokenPayload;

  try {
    // Query the db to find the user by their ID
    const existingUsers = await prisma.user.findMany({
      where: { id: userId },
    });

    if (existingUsers === 0) {
      return res.status(400).json({ error: "User not found." });
    }
    //Query from db on user reservations
    const reservations = await prisma.reservation.findMany({
      where: { userId: userId },
    });

    res.json(reservations);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).send("Error fetching data");
  }
});

// Create a new reservation
app.post("/api/reservation", authMiddleware(), async (req, res) => {
  // GET reservation data from body
  const { numberOfPassengers, status, flightDetails } = req.body;
  // GET user id from payload
  const { userId } = req.tokenPayload;

  try {
    // Query the db to find the user by their ID
    const existingUsers = await prisma.user.findMany({
      where: { id: userId }, // Corrected to find by 'id' instead of 'userId'
    });
    // Check if the user exists
    if (existingUsers === 0) {
      return res.status(400).json({ error: "User not found." });
    }
    // Create a new reservation in the database
    const reservation = await prisma.reservation.create({
      data: {
        userId: existingUsers[0].id,
        flightData: flightDetails,
        numberOfPassengers: numberOfPassengers,
        totalPrice: flightDetails.price,
        status: status,
      },
    });

    res.json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).send("Error fetching data");
  }
});
// Protected route to get user information
app.get("/", authMiddleware(), async (req, res) => {
  try {
    // Get userId from payload
    const { userId } = req.tokenPayload;
    // Find a user matching the user Id and put it into the user object
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

// Refresh access token
app.post("/refresh-token", authMiddleware(), (req, res) => {
  // Extract the refresh token from cookies
  const { refreshToken } = req.cookies;

  // If the token is not present, respond with 401 Unauthorized
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, payload) => {
    if (err) return res.sendStatus(403);

    const { userId } = payload; // Extract the userId from the token payload
    const newAccessToken = jwt.sign(
      { userId }, // Payload for the new token
      process.env.ACCESS_SECRET_TOKEN, // Secret key for signing the token
      { expiresIn: "10m" } // New access token with a 10-minute expiry
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true, // Cookie cannot be accessed via JavaScript (enhanced security)
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // Cookies are not sent with cross-site requests
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    return res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
