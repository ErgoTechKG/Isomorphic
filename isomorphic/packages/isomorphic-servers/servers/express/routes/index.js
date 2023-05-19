import express from "express";

import { PrismaClient } from "@prisma/client";
import Config from "../config";

const { port, secretKey, expiredAfter } = Config;
// Create an instance of the Prisma client
const prisma = new PrismaClient();

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "OK1" });
});

// router.post("/login", (req, res) => {
//   console.log("req.body", req.body);
//   res.json({ status: "OK2" });
// });

router.put("/user",async (req, res) => {
  
  const { body } = req;

  Object.keys(body).forEach((key) => {
    if (body[key] === null) {
      body[key] = undefined;
    }
  });

  const updateUser = await prisma.user.update({
    where: {
      id: body.id,
    },
    data: body,
  })

  res.json(updateUser);
})

router.get("/users",async (req, res) => {
  console.log("req.body", req.body);
  try {
    const users = await prisma.user.findMany(
      {select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        profile: true,
      },}
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});



//router.post('/', createUser);
export default router;
