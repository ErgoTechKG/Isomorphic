import express from "express";

import { PrismaClient } from "@prisma/client";
import Config from "../config";
import jwtDecode from "jwt-decode";
import productRouter from './product.js';
import cargoRouter from './cargo.js';
import rollRouter from './roll.js';
import saleRouter from './sale.js';


const { port, secretKey, expiredAfter } = Config;
// Create an instance of the Prisma client
const prisma = new PrismaClient();

const router = express.Router();

router

router.get("/", (req, res) => {
  res.json({ status: "OK1" });
});

// router.post("/login", (req, res) => {
//   console.log("req.body", req.body);
//   res.json({ status: "OK2" });
// });

router.put("/user", async (req, res) => {
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
  });

  res.json(updateUser);
});

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

router.get("/financialTransactions", async (req, res) => {
  try {
    const records = await prisma.finance.findMany();
    res.json(records);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching financialTransactions.",
      });
  }
});

router.post("/financialTransaction", async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { userFrom, userTo, description, amount, status, idToken } = req.body;
    const profile = jwtDecode(idToken);
    console.log("profile", profile);

    const record = await prisma.financialTransaction.create({
      data: {
        userFromId: userFrom,
        userToId: userTo,
        description,
        amount,
        status,
        inputerId: profile.id,
      },
    });

    res.json(record);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching financialTransactions.",
      });
  }
});

// router.post("/product", async (req, res) => {
//   console.log("req.body", req.body);
//   const { name, codeFromSupplier, ingredient, imageUrl } = req.body;
//   // const profile = jwtDecode(idToken);
//   // console.log(
//   //   'profile', profile
//   // )

//   const record = await prisma.product.create({
//     data: {
//       name,
//       codeGenerated: shortid.generate(),
//       codeFromSupplier,
//       imageUrl,
//     },
//   });

//   console.log('ingredient', ingredient)
//   const updatedIngredients = ingredient.map((element) => {
//     return Object.assign({}, element, { productId: record.id });
//   });
//   // // Create posts associated with the user
//   const posts = await prisma.ingredient.createMany({
//     data: updatedIngredients,
//   });

//   res.json(record);
// });

router.get("/usages", async (req, res) => {
  try {
    const records = await prisma.Garments.findMany({
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching financialTransactions.",
      });
  }
});

router.get("/catagories", async (req, res) => {
  try {
    const records = await prisma.Category.findMany({
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching financialTransactions.",
      });
  }
});

router.get("/materials", async (req, res) => {
  try {
    const records = await prisma.Material.findMany({
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching financialTransactions.",
      });
  }
});




router.post("/temporary-upload", async (req, res) => {

  const {  imageUrl } = req.body;


  res.json(record);
});


router.use('/product', productRouter);
router.use('/cargo', cargoRouter);
router.use('/roll', rollRouter);
router.use('/sale', saleRouter);

export default router;
