const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateRolls(targetAmount) {
    const lowerBound = targetAmount * 0.93;
    const upperBound = targetAmount * 1.03;

    // Fetch the rolls
    const rolls = await prisma.roll.findMany({
        where: {
            saleId: null,
            kentCode: 'k17e0db',
            rbg: {
                contains: '黑',
            },
        },
        orderBy: {
            id: 'asc',
        },
    });
    const rollnumber = 35;
    // Find a suitable set of 10 rolls
    for (let i = 0; i <= rolls.length - rollnumber; i++) {
        let totalAmount = 0;
        for (let j = i; j < i + rollnumber; j++) {
            totalAmount += rolls[j].amount;
        }
        console.log('totalAmount')
        if (totalAmount >= lowerBound && totalAmount <= upperBound) {
            // Update the records if a suitable set is found
            const startId = rolls[i].id;
            const endId = rolls[i + (rollnumber-1)].id;

            await prisma.roll.updateMany({
                where: {
                    id: {
                        gte: startId,
                        lte: endId,
                    },
                },
                data: {
                    saleId: 4,
                },
            });

            console.log(`Updated rolls from id ${startId} to ${endId}`);
            return;
        }
    }

    console.log('No suitable set of rolls found');
}

// Example usage
updateRolls(1130).catch(e => {
    throw e;
}).finally(async () => {
    await prisma.$disconnect();
});