import express from "express";

import { PrismaClient } from "@prisma/client";
import Config from "../config";
import jwtDecode from 'jwt-decode';
import shortid from 'shortid';


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


router.get("/financialTransactions",async (req, res) => {

  try {
    const records = await prisma.financialTransaction.findMany({
      include: {
        userFrom:  {
          select: {
            id: true,
            name: true
          }
        },
        userTo:  {
          select: {
            id: true,
            name: true
          }
        },
      },
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching financialTransactions.' });
  }
});

router.post("/financialTransaction",async (req, res) => {

  try {
    console.log('req.body', req.body)

    const {
      userFrom,
      userTo,
      description,
      amount,
      status,
      idToken
    } = req.body;
    const profile = jwtDecode(idToken);
    console.log(
      'profile', profile
    )

    const record = await prisma.financialTransaction.create({
      data: {
        userFromId: userFrom,
        userToId: userTo,
        description,
        amount,
        status,
        inputerId:profile.id
      },
    });


    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching financialTransactions.' });
  }
});

router.post("/product",async (req, res) => {

  console.log('req.body', req.body)
    const {
      name,
      codeFromSupplier,
      ingredient,
      imageUrl,
    } = req.body;
    // const profile = jwtDecode(idToken);
    // console.log(
    //   'profile', profile
    // )

    const record = await prisma.product.create({
      data: {
        name,
        codeGenerated:shortid.generate(),
        codeFromSupplier,
        ingredient,
        imageUrl,
        
      },
    });


    res.json(record);
  // try {
  //   console.log('req.body', req.body)


    
  //   const {
  //     userFrom,
  //     userTo,
  //     description,
  //     amount,
  //     status,
  //     idToken
  //   } = req.body;
  //   const profile = jwtDecode(idToken);
  //   console.log(
  //     'profile', profile
  //   )

  //   const record = await prisma.product.create({
  //     data: {
  //       userFromId: userFrom,
  //       userToId: userTo,
  //       description,
  //       amount,
  //       status,
  //       inputerId:profile.id
  //     },
  //   });


  //   res.json(record);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'An error occurred while fetching financialTransactions.' });
  // }
});

//router.post('/', createUser);
export default router;
