import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "./Input";
import { useSnackbar } from "notistack";

const baseUrl = "http://localhost:3000"; // Base URL for API requests

function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [variant, setVariant] = useState("login");
  const navigate = useNavigate();

  // Function to toggle between login and register forms
  const toogleVariant = () => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  };

  // Function to handle user login
  const login = async () => {
    try {
      // Send a POST request to the login API endpoint with email and password information
      const response = await axios.post(
        `${baseUrl}/api/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Include credentials in the request
        }
      );
      // If login is successful
      if (response.status === 200) {
        // Success  notification
        enqueueSnackbar("You have successfully logged in!", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        });
        // Clear all input
        setEmail("");
        setPassword("");
        navigate("/");
      }
      // If login fails, display an error notification
    } catch (error) {
      enqueueSnackbar("Incorrect password or email. Please try again.", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
      setEmail("");
      setPassword("");
      console.log(error);
    }
  };
  // If register is successful
  const register = async () => {
    try {
      // Send a POST request to the registration API endpoint with email,name,password information
      const response = await axios.post(`${baseUrl}/api/register`, {
        email,
        name,
        password,
      });
      // Success  notification
      if (response.status === 200) {
        enqueueSnackbar("Your registration was completed successfully!", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        });
        // Automatically log in the user after successful registration
        login();
      }
      // If Register fails, display an error notification
    } catch (error) {
      enqueueSnackbar(" Please enter a valid email address and password.", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
      // Clear all input
      setEmail("");
      setPassword("");
      setName("");
      console.log(error);
    }
  };
  return (
    <div className="relative h-screen w-full bg-customBodyColor bg-no-repeat bg-fixed bg-cover">
      <div className="w-full h-full">
        <div className="flex justify-center w-full h-full">
          <div className="bg-customBgColor px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-black text-4xl mb-8 font-semibold">
              {variant === "login" ? "Sign in" : "Register"}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === "register" && (
                <Input
                  label="Username"
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  value={name}
                />
              )}

              <Input
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                value={email}
                type="email"
              />
              <Input
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                value={password}
                type="password"
              />
            </div>
            <button
              onClick={variant === "login" ? login : register}
              className="bg-purple-800 py-3 text-white rounded-md w-full mt-10 hover:bg-purple-700 transition"
            >
              {variant === "login" ? "Sign in" : "Register"}
            </button>
            <p className="text-neutral-500 mt-12 text-sm">
              {variant === "login"
                ? "First time using Plane Scape ?"
                : "Already have an account?"}
              <span
                onClick={toogleVariant}
                className="text-purple-400 ml-2 hover:underline cursor-pointer"
              >
                {variant === "login" ? "Create an account" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
