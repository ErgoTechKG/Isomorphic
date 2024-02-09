import express from "express";
import { PrismaClient } from "@prisma/client";
import {uid} from "uid";
//import { getRollFromSheet } from "../scripts/googleSheetsRolls";

const prisma = new PrismaClient();
const router = express.Router();

async function generateUniqueID() {
  try {
    let existingProd;
    let newID;
    do {
      newID = "k1" + uid(5); // Generate a new ID with a length of 5 characters.
      existingProd = await prisma.roll.findFirst({
        where: { kentCode: newID },
      });
    } while (existingProd);

    // At this point, the generated ID is unique and can be used.
    return newID;
  } catch (err) {
    console.log("error", err);
  }
}

// Define routes for /api/product here
router.get("/all", async (req, res) => {
  const rolls = await prisma.roll.findMany();
  res.send(rolls);
});


// // Define routes for /api/product here
// router.get("/bulk", async (req, res) => {
//   let sheetResult = await getRollFromSheet();
//   console.log('sheetResult', sheetResult)
//   const cargos = await prisma.roll.createMany({
//     data: sheetResult,
//     //skipDuplicates: true // Optional: skips the insert if a record with unique constraint already exists
//   });
//   res.send([]);
// });

// Define routes for /api/product here
router.delete("/", async (req, res) => {
  console.log(req.query)
  const deletedProduct = await prisma.product.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  // Step 2: Fetch all products after deletion
  const allProducts = await prisma.product.findMany();

  res.send(allProducts);
});


// router.post("/", async (req, res) => {
//
//   console.log('received from frontend', req.body,req.query)
//   const cargo = await prisma.cargo.upsert({
//     where: { dateArrived: req.body.date },
//     update: {}, // No update operation since we just want to fetch the ID if it exists
//     create: { dateArrived: req.body.date  }
//   });
//
//   const rolls = await prisma.cargo.create({
//     data: {
//       name: 'Alice',
//       email: 'alice@example.com',
//     },
//   })
//   console.log(cargo.id);
//   res.send("post product");
//
// });

router.post("/", async(req, res) => {
    try {
      console.log(req.body)
      const {rbg, amount, unit, cost, kentCode} = req.body;
      const record = await prisma.roll.create({
        data: {
          rbg,
          amount,
          unit,
          cost,
          kentCode,
        }
      })
      console.log("Record created successfully!", record);
      res.json(record);

      }  catch(err)  {
        console.log("Error at creating data for roll table", err);
    }

})


router.put("/", async(req, res) => {
  const record = await prisma.roll.update({
    where: {
      id: parseInt(req.query.id)
    },
    data: req.body
  })
  res.send(record);
})

router.get("/generateCode", async (req, res) => {
  try {
    const newProductID = await generateUniqueID();

    res.send(newProductID);
  } catch (err) {
    console.log("error", err);
  }
});

router.post("/generateCodeValidation", async (req, res) => {
  try {
    const existingID = await prisma.roll.findFirst({
      where: { kentCode: req.body.value },
    });

    if (existingID) {
      return res.status(409).json({ error: "Kent code already exists" });
    }
    res.send("ok");
  } catch (err) {
    console.log("error", err);
  }
});


// Export the router
export default router;
