import { Hono } from "hono";
import { bookRouter } from "./routes/blog";
import { userRouter } from "./routes/user";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
//env variable passing as String type to resolve ts error

app.route("/api/v1/user", userRouter);
app.route("/api/v1/book", bookRouter);

export default app;
