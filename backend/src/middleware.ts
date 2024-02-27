import { verify } from "hono/jwt";

export function initMiddleware(app) {
  app.use("/api/v1/blog/*", async (c, next) => {
    const header = c.req.header("authorization") || "";
    const token = header.split(" ")[1];

    //   bearer token => ["bearer","jwt token"]

    const response = await verify(token, c.env.JWT_SECRET);
    if (response.id) {
      next();
    } else {
      c.status(403);
      return c.json({ error: "Unauthorized" });
    }
  });
}
