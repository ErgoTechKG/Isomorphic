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
router.get("/", async (req, res) => {
  const result = await prisma.product.findUnique({
    where: {
      id:parseInt(req.query.id),
    },
  })
  res.send(result);
});

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

router.get("/all", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    const logisticRMB = await prisma.variables.findFirst({
      where: {
        // Your condition here, for example, filtering products with priceChinaMeter greater than 0
        name: 'logisticRMB'
      },
      orderBy: {
        createdAt: 'desc', // Sorting by createdAt field in descending order (newest to oldest)
      },
    });
    const exRate = await prisma.variables.findFirst({
      where: {
        // Your condition here, for example, filtering products with priceChinaMeter greater than 0
        name: 'exRate'
      },
      orderBy: {
        createdAt: 'desc', // Sorting by createdAt field in descending order (newest to oldest)
      },
    });

    console.log('logisticRMB', logisticRMB.value, exRate.value)

    const result = products.map(i => {
      let priceAtStock;
    
      // console.log('i.codeChina', i.codeChina)
      // console.log('i.width', i.width)
      // console.log('i.gram', i.gram)
      // if(i.codeChina=="98653") {
      //   console.log('i.priceChinaKG', i.priceChinaKG)
      //   console.log('how many meter per kg', (1000/i.width/i.gram)*100)
      //   console.log('cost in kg bkk rmb', (parseFloat(i.priceChinaKG?i.priceChinaKG:((1000/i.width/i.gram)*100*i.priceChinaMeter ))+ parseFloat(logisticRMB.value)))
      //   console.log('cost in kg bkk', ( (parseFloat(i.priceChinaKG?i.priceChinaKG:((1000/i.width/i.gram)*100*i.priceChinaMeter ))+ parseFloat(logisticRMB.value))/exRate.value))
      // }
      // 
      // console.log('cost in Bihskek per kg', ((i.priceChinaKG?i.priceChinaKG:(1000/i.width/i.gram)*100*i.priceChinaMeter + logisticRMB.value)/exRate.value))
      let costBkkM = ((parseFloat(i.priceChinaKG?i.priceChinaKG:((1000/i.width/i.gram)*100*i.priceChinaMeter ))+ parseFloat(logisticRMB.value))/exRate.value)/((1000/i.width/i.gram)*100)
      if (i.currentPrice && i.currentPrice>costBkkM) {
        priceAtStock = currentPrice
      } else {
        if (!i.marketPrice) {
          priceAtStock = costBkkM * 1.3;
        } else {
          if(i.marketPrice*0.9<costBkkM*1.1)
            priceAtStock = costBkkM * 1.1;
          else
            priceAtStock = i.marketPrice * 0.9
        }
      }
      // if(i.codeChina=="98653") {
      //   console.log('costBkkM', costBkkM)
      // }

      const updatedProduct = {
        id: i.id,
        source: i.source,
        codeKent: i.codeKent,
        codeKent0: i.codeKent0,
        codeChina: i.codeChina,
        nameRussian: i.nameRussian,
        nameChinese: i.nameChinese,
        nameEnglish: i.nameEnglish,
        subCat: i.subCat,
        width: i.width,
        gram: i.gram,
        marketPrice: i.marketPrice,
        imageURL: i.imageURL,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        note: i.note,
        currentPrice: i.currentPrice,
        vipPrice:costBkkM*1.1,
        priceAtStock: priceAtStock // Add the 'priceAtStock' field with a value of 0
      };
      

      
      //console.log(i.priceChinaKG, i.priceChinaMeter)
      return updatedProduct
    })
    res.send(result);
  } catch (error) {
    console.error('Error retrieving products:', error);
  } 
  
});

router.post("/", async (req, res) => {

  const record = await prisma.product.create({
    data: req.body,
  });
  res.send("post product");
});


router.put("/", async (req, res) => {
  const record = await prisma.product.update({
    where: {
      id: parseInt(req.query.id)  // Assuming id is an integer; adapt as needed
    },
    data: req.body
  });
  res.send(record);
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
