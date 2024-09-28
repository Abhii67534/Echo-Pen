import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { postRouter } from './routes/post';
import { cors } from 'hono/cors';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// Configure CORS
app.use('/user/*', cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend URL
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed methods
  allowHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  credentials: true // If you need to send credentials (e.g., cookies)
}));

app.use('/post/*', cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend URL
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed methods
  allowHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  credentials: true // Allow credentials (e.g., cookies)
}));

// Setup routes
app.route("/user", userRouter);
app.route("/post", postRouter);

export default app;
