const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getFinances() {
  try {
    const result = await prisma.finance.aggregate({
        _sum: {
          incomeUSD: true,
          expenseUSD: true,
          incomeSom: true,
          expenseSom: true
        },
      });
    const cash = (result._sum.incomeUSD-result._sum.expenseUSD)+ (result._sum.incomeSom-result._sum.expenseSom)/89.7
    return cash;
  } catch (error) {
    console.error("Error calculating profits:", error);
  } finally {
    await prisma.$disconnect();
  }
}


getFinances().then((data) => console.log(data));
