const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateRollCosts() {
  try {
    // Find all Roll records with cost null or 0
    const rolls = await prisma.roll.findMany({
      where: {
        OR: [{ cost: null }, { cost: 0 }],
      },
    });

    // Iterate over each roll and update cost
    for (const roll of rolls) {
      if (roll.kentCode) {
        // Find the corresponding product
        const product = await prisma.product.findUnique({
          where: {
            codeKent: roll.kentCode,
          },
        });

        if (product) {
          let costToUpdate = 0;

          // Check if priceChinaKG or priceChinaMeter exists and is not zero
          if (product.priceChinaKG && product.priceChinaKG !== 0) {
            costToUpdate = product.priceChinaKG;
          } else if (product.priceChinaMeter && product.priceChinaMeter !== 0) {
            costToUpdate = product.priceChinaMeter;
          }

          // Update the cost of the roll if a new cost is found
          if (costToUpdate !== 0) {
            await prisma.roll.update({
              where: {
                id: roll.id,
              },
              data: {
                cost: costToUpdate,
              },
            });
            console.log({'id':roll.id, 'cost':costToUpdate})
          }
        }
      }
    }

    console.log('Roll costs updated successfully.');
  } catch (error) {
    console.error('Error updating roll costs:', error);
  }
}

// Run the function
updateRollCosts();
