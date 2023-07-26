import express from "express";
import { uid } from "uid";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

async function generateUniqueID() {
  let existingProd;
  let newID;
  do {
    newID = "k1" + uid(5); // Generate a new ID with a length of 5 characters.
    existingProd = await prisma.product.findFirst({
      where: { codeKent: newID },
    });
  } while (existingProd);

  // At this point, the generated ID is unique and can be used.
  return newID;
}

// Define routes for /api/product here
router.get("/", (req, res) => {
  res.send("Product API");
});

router.get("/all", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    console.log(products);
    res.send(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
  } 

  
});

router.post("/", async (req, res) => {
  console.log("req.body", req.body);
  
  const record = await prisma.product.create({
    data: req.body,
  });
  res.send("post product");
});

router.get("/generateCode", async (req, res) => {
  const newProductID = await generateUniqueID();

  res.send(newProductID);
});

router.post("/generateCodeValidation", async (req, res) => {
  const existingID = await prisma.product.findFirst({
    where: { codeKent: req.body.value },
  });

  if (existingID) {
    return res.status(409).json({ error: "Kent code already exists" });
  }
  res.send("ok");
});

// Export the router
export default router;
