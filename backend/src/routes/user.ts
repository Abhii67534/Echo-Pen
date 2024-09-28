import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify } from 'hono/jwt';
import axios from 'axios';

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    HONO_R2_UPLOAD: R2Bucket;
  };
}>();

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.parseBody();
  console.log('Uploaded file:', body['avatar']);
  console.log('Email:', body['email']);
  console.log('Name:', body['name']);

  const file = body['avatar'];
  let avatarUrl = null;

  if (file && file instanceof File) {
    console.log("Uploading file...");
    try {
      await c.env.HONO_R2_UPLOAD.put(file.name, file); 
      console.log("File upload completed.");
      avatarUrl = `https://echo-pen.org/${file.name}`;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  } else {
    console.error("Uploaded file is not a valid File object.");
  }
 
  const user = await prisma.user.create({
    data: {
      email: body['email'] as string,
      name: body['name'] as string,
      password: body['password'] as string,
      avatar: avatarUrl || null, 
    },
  });

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ token: token });
});


userRouter.post('/signin', async (c) => {
  console.log(c.env.JWT_SECRET);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  })

  if (!user) {
    return c.json({ msg: "User not found in database" }, 404);
  }
  if (user) {
    if (body.password != user.password) {
      return c.json({ msg: "Incorrect password" })
    }
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({
      msg: "Signin successfull",
      token: token
    })
  }
})

userRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const alluser = await prisma.user.findMany();
  if (!alluser) {
    return c.json("No users");
  }

  return c.json(alluser);

});


userRouter.get('/images', async (c) => {
  try {
    const list = await c.env.HONO_R2_UPLOAD.list(); 
    return c.json(list);
  } catch (error) {
    console.error("Error listing files in R2 bucket:", error);
    return c.json({ error: "Failed to list images" }, 500);
  }
});


export default userRouter
