import jwt from "jsonwebtoken";
// Middleware function to authenticate requests using JWT
export default function authMiddleware() {
  return (req, res, next) => {
    // Extract the access token from cookies
    const { accessToken } = req.cookies;
    // If the token is not present, respond with 401 Unauthorized
    if (!accessToken) return res.sendStatus(401);
    // Verify the access token using the secret stored in environment variables
    jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (err, payload) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "Invalid token" });
      }
      // Attach the token payload to the request object for further use
      req.tokenPayload = payload;

      // Proceed to the next middleware or route handler
      next();
    });
  };
}
