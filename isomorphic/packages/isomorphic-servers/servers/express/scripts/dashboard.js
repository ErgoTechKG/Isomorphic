const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getFinances() {
  try {
    const financeData = await prisma.finance.groupBy({
      by: ["cat"],
      _sum: {
        incomeUSD: true,
        incomeSom: true,
        expenseUSD: true,
        expenseSom: true,
      },
      where: {
        // Your filter conditions here, if any
      },
    });
    return financeData;
  } catch (error) {
    console.error("Error calculating profits:", error);
  } finally {
    await prisma.$disconnect();
  }
  //console.log('financeData', financeData);
}

// // Example usage
// getFinances()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function calculateProfit() {
  try {
    const salesWithProfit = await prisma.sale.findMany({
      where: {
        status: { in: ["Finished", "Delivered"] },
      },
      select: {
        id: true,
        amount: true,
        priceUSD: true,
        status: true,
        note: true,
        Roll: {
          select: {
            cost: true,
            amount: true,
            unit: true,
          },
        },
      },
    });
    //console.log('salesWithProfit', salesWithProfit)
    const profits = salesWithProfit.map((sale) => {
      const totalCost = sale.Roll.reduce(
        (acc, roll) =>
          acc +
          (roll.unit == "kg"
            ? parseFloat(roll.cost) / 7.1 + 0.7
            : parseFloat(roll.cost) / 7.1) *
            parseFloat(roll.amount),
        0
      );

      const saleAmount = parseFloat(sale.amount) * parseFloat(sale.priceUSD);
      const profit = parseFloat(saleAmount) - parseFloat(totalCost);
      return {
        saleId: sale.id,
        profit: profit.toFixed(2),
        saleAmount: saleAmount.toFixed(2),
        sale: sale.note,
        totalCost: totalCost.toFixed(2),
        rollNumber: sale.Roll.length,
        profitRate: ((profit * 100) / saleAmount).toFixed(0) + "%",
      };
    });

    return profits;
  } catch (error) {
    console.error("Error calculating profits:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// calculateProfit().then(profits => {
//     console.log('profits', profits)
//     const totalProfit = profits.reduce((acc, curr) => acc + parseFloat(curr.profit), 0);
//     const totalCost = profits.reduce((acc, curr) => acc + parseFloat(curr.totalCost), 0);
//     console.log('totalProfit', totalProfit)
//     console.log('totalCost', totalCost)
// });

async function calculateProfitProcessing() {
  try {
    const salesWithProfit = await prisma.sale.findMany({
      where: {
        status: { in: ["Processing"] },
      },
      select: {
        id: true,
        amount: true,
        priceUSD: true,
        status: true,
        note: true,
        Roll: {
          select: {
            cost: true,
            amount: true,
            unit: true,
          },
        },
      },
    });
    //console.log('salesWithProfit', salesWithProfit)
    const profits = salesWithProfit.map((sale) => {
      const totalCost = sale.Roll.reduce(
        (acc, roll) =>
          acc +
          (roll.unit == "kg"
            ? parseFloat(roll.cost) / 7.1 + 0.7
            : parseFloat(roll.cost) / 7.1) *
            parseFloat(roll.amount),
        0
      );

      const saleAmount = parseFloat(sale.amount) * parseFloat(sale.priceUSD);
      const profit = parseFloat(saleAmount) - parseFloat(totalCost);
      return {
        saleId: sale.id,
        profit: profit.toFixed(2),
        saleAmount: saleAmount.toFixed(2),
        sale: sale.note,
        totalCost: totalCost.toFixed(2),
        rollNumber: sale.Roll.length,
        profitRate: ((profit * 100) / saleAmount).toFixed(0) + "%",
      };
    });

    return profits;
  } catch (error) {
    console.error("Error calculating profits:", error);
  }
}

// calculateProfitProcessing().then(profits => {
//     console.log('profits', profits)
//     const totalProfit = profits.reduce((acc, curr) => acc + parseFloat(curr.profit), 0);
//     const totalCost = profits.reduce((acc, curr) => acc + parseFloat(curr.totalCost), 0);
//     console.log('totalProfit', totalProfit)
//     console.log('totalCost', totalCost)
// });

async function fetchProductsMap() {
  try {
    const products = await prisma.product.findMany();
    const productsMap = new Map();
    products.forEach((product) => {
      productsMap.set(product.codeKent, {
        nameChinese: product.nameChinese,
        nameRussian: product.nameRussian,
        codeChina: product.codeChina,
      });
    });
    return productsMap;
  } catch (error) {
    console.error("Error calculating profits:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function getNamesAndCalculateSoldOutRatios() {
  try {
    const [productsMap, rolls] = await Promise.all([
      fetchProductsMap(),
      prisma.roll.findMany(),
    ]);

    let rollData = rolls.reduce((acc, roll) => {
      const product = productsMap.get(roll.kentCode) || {};
      if (!acc[roll.kentCode]) {
        acc[roll.kentCode] = {
          total: 0,
          soldOut: 0,
          nameChinese: product.nameChinese,
          nameRussian: product.nameRussian,
          codeChina: product.codeChina,
        };
      }

      acc[roll.kentCode].total++;
      if (roll.saleId) {
        acc[roll.kentCode].soldOut++;
      }

      return acc;
    }, {});

    let finalData = Object.keys(rollData).map((kentCode) => {
      const data = rollData[kentCode];
      const ratio = data.total > 0 ? data.soldOut / data.total : 0;
      return {
        kentCode: kentCode,
        total: data.total,
        Chinesename: data.nameChinese,
        Russianname: data.nameRussian,
        codeChina: data.codeChina,
        ratio: `${ratio.toFixed(2) * 100}%`,
      };
    });

    return finalData;
  } catch (error) {
    console.error("Error calculating profits:", error);
  } finally {
    await prisma.$disconnect();
  }
}

//   // Example usage
//   getNamesAndCalculateSoldOutRatios().then(data => console.log(data));

async function fetchNonSoldRolls() {
  try {
    return await prisma.roll.findMany({
      where: {
        saleId: null,
      },
      select: {
        kentCode: true,
        // You may include other fields if needed
      },
    });
  } catch (error) {
    console.error("Error calculating profits:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function groupRollsByKentCode(rolls) {
  try {
    const rollGroups = rolls.reduce((acc, roll) => {
      acc[roll.kentCode] = (acc[roll.kentCode] || 0) + 1;
      return acc;
    }, {});

    return rollGroups;
  } catch (error) {
    console.error("Error calculating profits:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function fetchProductNames(rollGroups) {
  try {
    const productNames = {};

    for (const kentCode of Object.keys(rollGroups)) {
      const product = await prisma.product.findUnique({
        where: {
          codeKent: kentCode,
        },
        select: {
          nameChinese: true,
          nameRussian: true,
          codeChina: true,
          // You may include other fields if needed
        },
      });

      productNames[kentCode] = {
        count: rollGroups[kentCode],
        nameRussian: product.nameRussian,
        nameChinese: product.nameChinese,
        codeChina: product.codeChina,
      };
    }

    return productNames;
  } catch (error) {
    console.error("Error calculating profits:", error);
  } finally {
    await prisma.$disconnect();
  }
}
async function analyzeNonSoldRolls() {
  const [nonSoldRolls, groupedRolls, productDetails] = await Promise.all([
    fetchNonSoldRolls(),
    groupRollsByKentCode(nonSoldRolls),
    fetchProductNames(groupedRolls),
  ]);
  return productDetails;
}

// Example usage
//analyzeNonSoldRolls().then((data) => console.log(data));
module.exports = {
  getFinances,
  calculateProfit,
  calculateProfitProcessing,
  getNamesAndCalculateSoldOutRatios,
  analyzeNonSoldRolls,
};
