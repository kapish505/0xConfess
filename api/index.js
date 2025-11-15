import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../server/routes.js";

const app = express();

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Error handler
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Initialize routes
let initialized = false;
let handler = null;

async function initializeApp() {
  if (!initialized) {
    try {
      await registerRoutes(app);
      handler = serverless(app);
      initialized = true;
    } catch (error) {
      console.error("Failed to initialize app:", error);
      throw error;
    }
  }
  return handler;
}

export default async function(req, res) {
  const serverlessHandler = await initializeApp();
  return serverlessHandler(req, res);
}

