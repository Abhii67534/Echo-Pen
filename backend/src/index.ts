import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { postRouter } from "./routes/post";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// Define allowed origins
const allowedOrigins = [
  "https://echo-pen-v1yi.vercel.app",
  "https://echo-pen-v1yi-3ko5sz3k6-abhii67534s-projects.vercel.app",
  "http://localhost:5173",
  "https://echo-pen.netlify.app",
  "https://echo-pen-two.vercel.app"
];

// Function to determine if the origin is allowed
const corsOrigin = (origin: string) => {
  return allowedOrigins.includes(origin) ? origin : null; // Return origin if allowed, else null
};

// Configure CORS for user routes
app.use(
  "/user/*",
  cors({
    origin: corsOrigin,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (e.g., cookies)
  })
);

// Configure CORS for post routes
app.use(
  "/post/*",
  cors({
    origin: corsOrigin,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (e.g., cookies)
  })
);

// Setup routes
app.route("/user", userRouter);
app.route("/post", postRouter);

export default app;
