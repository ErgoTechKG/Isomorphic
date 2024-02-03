import express from "express";
import { uid } from "uid";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

async function generateUniqueID() {
 try {
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
 } catch(err) {
   console.log('error', err);
 }
}

// Define routes for /api/product here
router.get("/", async (req, res) => {
  try {
    console.log('prisma.product', prisma.product)
    const result = await prisma.product.findUnique({
      where: {
        id: parseInt(req.query.id),
      },
    });
    console.log('productid', result)
    res.send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Define routes for /api/product here
router.delete("/", async (req, res) => {
  try {
    console.log(req.query);
    const deletedProduct = await prisma.product.delete({
      where: {
        id: parseInt(req.query.id),
      },
    });

    // Step 2: Fetch all products after deletion
    const allProducts = await prisma.product.findMany();

    res.send(allProducts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/all", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    // const logisticReUSD = await prisma.variables.findFirst({
    //   where: {
    //     // Your condition here, for example, filtering products with priceChinaMeter greater than 0
    //     name: "logisticReUSD",
    //   },
    //   orderBy: {
    //     createdAt: "desc", // Sorting by createdAt field in descending order (newest to oldest)
    //   },
    // });
    // const exRate = await prisma.variables.findFirst({
    //   where: {
    //     // Your condition here, for example, filtering products with priceChinaMeter greater than 0
    //     name: "exRate",
    //   },
    //   orderBy: {
    //     createdAt: "desc", // Sorting by createdAt field in descending order (newest to oldest)
    //   },
    // });
    //
    // const logisticPluffUSD = await prisma.variables.findFirst({
    //   where: {
    //     // Your condition here, for example, filtering products with priceChinaMeter greater than 0
    //     name: "logisticPluffUSD",
    //   },
    //   orderBy: {
    //     createdAt: "desc", // Sorting by createdAt field in descending order (newest to oldest)
    //   },
    // });
    const [logisticReUSD, exRate, logisticPluffUSD] = await Promise.all([
      prisma.variables.findFirst({ where: { name: "logisticReUSD" } }),
      prisma.variables.findFirst({ where: { name: "exRate" } }),
      prisma.variables.findFirst({ where: { name: "logisticPluffUSD" } }),
    ]);

    console.log(
      "logisticReUSD",
      logisticReUSD.value,
      exRate.value,
      logisticPluffUSD.value
    );

    const result = products.map((i) => {
      let logisticUSD = i.isPluff
        ? parseFloat(logisticPluffUSD.value)
        : parseFloat(logisticReUSD.value);
        
      let priceAtStock;
      let mPerKG = (1000 / i.width / i.gram) * 100;
      let costKGBKKUSD =
        parseFloat(
          i.priceChinaKG ? i.priceChinaKG : mPerKG * i.priceChinaMeter
        ) /
          parseFloat(exRate.value) +
        logisticUSD;

      if (i.codeKent == "k1e22b2") {
        console.log("logisticUSD", logisticUSD);
        console.log("i.codeChina", i.codeChina);
        console.log("i.width", i.width);
        console.log("i.gram", i.gram);
        console.log("i.priceChinaKG", i.priceChinaKG);
        console.log("i.priceChinaMeter", i.priceChinaMeter);
        console.log("how many meter per kg", mPerKG);
        console.log("cost in kg bkk usd", costKGBKKUSD);
        //console.log('cost in kg bkk', ( (parseFloat(i.priceChinaKG?i.priceChinaKG:((1000/i.width/i.gram)*100*i.priceChinaMeter ))+ logisticRMBFinal)/exRate.value))
      }

      // console.log('cost in Bihskek per kg', ((i.priceChinaKG?i.priceChinaKG:(1000/i.width/i.gram)*100*i.priceChinaMeter + logisticRMB.value)/exRate.value))
      let costBkkM = costKGBKKUSD / mPerKG;
      if (i.currentPrice && i.currentPrice > costBkkM) {
        priceAtStock = currentPrice;
      } else {
        if (!i.marketPrice) {
          priceAtStock = costBkkM * 1.1;
        } else {
          if (i.marketPrice * 0.8 < costBkkM * 1.1)
            priceAtStock = costBkkM * 1.1;
          else priceAtStock = costBkkM * 1.1;
        }
      }
      if (i.codeKent == "k1e22b2") {
        console.log("costBkkM", costBkkM);
        console.log("costBkkM 1.1", costBkkM * 1.1);
        console.log("i.marketPrice", i.marketPrice);
        console.log("i.marketPrice*0.9", i.marketPrice * 0.9);
      }

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
        priceUpdated: i.priceUpdated,
        vipPrice: costBkkM * 1.10,
        priceAtStock: i.priceUpdated?i.priceUpdated:costBkkM * 1.18, // Add the 'priceAtStock' field with a value of 0
        isPluff:i.isPluff,
        isResToChina:i.isResToChina, 
        isKentSample:i.isKentSample,
      };

      //console.log(i.priceChinaKG, i.priceChinaMeter)
      return updatedProduct;
    });
    res.send(result);
  } catch (error) {
    console.error("Error retrieving products:", error);
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("post product req.body", req.body)
    const record = await prisma.product.create({
      data: req.body,
    });
    console.log("post product record", record)
    res.send("post product");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/", async (req, res) => {
  try {
    console.log('req.body', req.body)
    const record = await prisma.product.update({
      where: {
        id: parseInt(req.query.id), // Assuming id is an integer; adapt as needed
      },
      data: req.body,
    });
    res.send(record);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/generateCode", async (req, res) => {
  try {
    const newProductID = await generateUniqueID();

    res.send(newProductID);
  } catch(err) {
    console.log("error", err);
  }
});

router.post("/generateCodeValidation", async (req, res) => {
  try {
    const existingID = await prisma.product.findFirst({
      where: { codeKent: req.body.value },
    });

    if (existingID) {
      return res.status(409).json({ error: "Kent code already exists" });
    }
    res.send("ok");
  } catch(err) {
    console.log("error", err);
  }
});

// Export the router
export default router;

