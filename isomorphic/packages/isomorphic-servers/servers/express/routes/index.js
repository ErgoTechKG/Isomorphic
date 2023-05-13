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


router.get("/users", (req, res) => {
  console.log("req.body", req.body);
  res.json({ status: "OK2" });
});



//router.post('/', createUser);
export default router;
