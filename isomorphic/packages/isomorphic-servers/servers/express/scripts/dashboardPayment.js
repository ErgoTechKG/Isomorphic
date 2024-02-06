// Importing the PrismaClient
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getClientFinancialSummary() {

  // Fetching the list of clients
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true
    }
  });

  // Aggregating Sales Data
  // Fetching Sales Data and calculating total sales per client
  const sales = await prisma.sale.findMany({
    where: {
      OR: [
        { status: 'Finished' },
        { status: 'Delivered' }
      ]
    },
    select: {
      clientId: true,
      priceUSD: true,
      amount: true
    }
  });

  const salesTotalByClient = sales.reduce((acc, sale) => {
    const total = (sale.priceUSD || 0) * (sale.amount || 0);
    acc[sale.clientId] = (acc[sale.clientId] || 0) + total;
    return acc;
  }, {});

  // Aggregating Finance Data
  const financeData = await prisma.finance.groupBy({
    by: ['clientId'],
    _sum: {
      incomeUSD: true,
      incomeSom: true,
      expenseUSD: true,
      expenseSom: true
    }
  });

  // Convert 'incomeSom' and 'expenseSom' to USD and calculate net income
  financeData.forEach(finance => {
    finance.netIncomeUSD = (finance._sum.incomeUSD || 0) - (finance._sum.expenseUSD || 0) +
      ((finance._sum.incomeSom || 0) - (finance._sum.expenseSom || 0)) / 89.5;
  });

  // Combining Sales and Finance Data
  const clientFinancialSummary = Object.keys(salesTotalByClient).map(clientId => {

    const finance = financeData.find(f => f.clientId === parseInt(clientId)) || {};

    const client = clients.find(client => client.id === parseInt(clientId));
    const clientName = client ? client.name : undefined;
    
    return {
      clientId: parseInt(clientId),
      salesTotal: salesTotalByClient[clientId].toFixed(2),
      paymentTotal: (finance.netIncomeUSD?finance.netIncomeUSD:0).toFixed(2),
      oweTotal:(parseFloat(salesTotalByClient[clientId])-parseFloat(finance.netIncomeUSD?finance.netIncomeUSD:0)).toFixed(2),
      clientName: clientName
    };
  });

  return clientFinancialSummary.sort((a, b) => a.clientId - b.clientId);
}

getClientFinancialSummary().then(console.log).catch(console.error);