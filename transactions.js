// transactions.js

const transactions = [
    {
        merchant: "Amazon",
        description: "Purchase of electronics",
        amount: -200.00,
        date: "2024-03-03 15:45:00",
        category: "Aaa"
    },
    {
        merchant: "Starbucks",
        description: "Coffee",
        amount: -5.00,
        date: "2024-03-02 08:30:00",
        category: "Aaa"
    },
    {
        merchant: "Walmart",
        description: "Groceries",
        amount: -50.00,
        date: "2024-03-29 14:00:00",
        category: "Aaa"
    },
    {
        merchant: "Netflix",
        description: "Subscription",
        amount: 10.00,
        date: "2024-03-28 18:00:00",
        category: "Aaa"
    },
    {
        merchant: "Amazon",
        description: "Purchase of electronics",
        amount: -200.00,
        date: "2024-03-04 15:45:00",
        category: "Aaa"
    },
    {
        merchant: "Amazon",
        description: "Purchase of electronics",
        amount: -200.00,
        date: "2024-03-05 15:45:00",
        category: "Aaa"
    },
    {
        merchant: "Amazon",
        description: "Purchase of electronics",
        amount: -200.00,
        date: "2024-03-06 15:45:00",
        category: "Aaa"
    },
    {
        merchant: "Amazon",
        description: "Purchase of electronics",
        amount: -200.00,
        date: "2024-03-06 15:45:00",
        category: "Bbb"
    },
    {
        merchant: "Amazon",
        description: "Purchase of electronics",
        amount: -200.00,
        date: "2024-03-07 15:45:00",
        category: "Bbb"
    },
    {
        merchant: "Netflix",
        description: "Subscription",
        amount: 10.00,
        date: "2024-03-17 18:00:00",
        category: "Bbb"
    },
    {
        merchant: "Netflix",
        description: "Subscription",
        amount: 10.00,
        date: "2024-02-28 18:00:00",
        category: "Bbb"
    },
    {
        merchant: "Netflix",
        description: "Subscription",
        amount: 10.00,
        date: "2024-02-28 18:00:00",
        category: "Bbb"
    },
    {
        merchant: "Netflix",
        description: "Subscription",
        amount: 10.00,
        date: "2024-02-28 18:00:00",
        category: "Bbb"
    },
    {
        merchant: "Netflix",
        description: "Subscription",
        amount: 10.00,
        date: "2024-02-28 18:00:00",
        category: "Bbb"
    },
    {
        merchant: "Netflix",
        description: "Subscription",
        amount: 10.00,
        date: "2024-02-28 18:00:00",
        category: "Bbb"
    }
    // Add more transactions as needed
];

// Group transactions by month
const transactionsByMonth = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    if (!acc[month]) {
        acc[month] = {
            transactions: [],
            total: 0
        };
    }
    acc[month].transactions.push(transaction);
    acc[month].total += transaction.amount;
    return acc;
}, {});

// Sort transactions by month
const sortedMonths = Object.keys(transactionsByMonth).sort();


// Export as Excel functionality
// const exportButton = document.getElementById('export-button');
// exportButton.addEventListener('click', () => {
//     const wb = XLSX.utils.book_new();
//     const wsData = [];
//     transactionList.querySelectorAll('li').forEach((li, index) => {
//         const isMonthlyTransaction = li.querySelector('.monthlyTransaction');
//         const isTransaction = li.querySelector('.transaction');
//         if (isMonthlyTransaction) {
//             const monthName = isMonthlyTransaction.querySelector('span').textContent;
//             const totalAmount = isMonthlyTransaction.querySelector('.total').textContent;
//             wsData.push([monthName, totalAmount]);
//         } else if (isTransaction) {
//             const merchant = isTransaction.querySelector('span').textContent;
//             const description = isTransaction.querySelector('div:nth-child(2)').textContent;
//             const amount = isTransaction.querySelector('.amount').textContent;
//             const date = isTransaction.querySelector('.date').textContent;
//             wsData.push([merchant, description, amount, date]);
//         }
//     });
//     const ws = XLSX.utils.aoa_to_sheet(wsData);
//     XLSX.utils.book_append_sheet(wb, ws, 'Transaction History');
//     XLSX.writeFile(wb, 'transaction-history.xlsx');
// });
