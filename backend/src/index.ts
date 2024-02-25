import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();
//env variable passing as String type to resolve ts error

app.use("/api/v1/blog/*", async (c, next) => {
  //middleware
  //get the header
  //verify the header
  //if the header is correct we can proceed
  //if not we tell the user 403
  const header = c.req.header("Authorization") || "";
  const token = header.split(" ")[1];
  const response = await verify(token, c.env.JWT_SECRET);

  if (response.id) {
    await next();
  } else {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }
});

app.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("get blog route");
});

app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ token });
  } catch (error) {
    c.status(404);
    return c.json({ error: "error in signup" });
  }
});

app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: { email: body.email, password: body.password },
  });

  if (!user) {
    c.status(303);
    return c.json({ error: "user not found" });
  }
  const jwt = await sign({ id: body.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

app.post("/api/v1/blog", (c) => {
  return c.text("blog post route");
});

app.put("/api/v1/blog", (c) => {
  return c.text("blog put route");
});

export default app;
