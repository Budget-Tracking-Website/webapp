import React, { useState, useEffect } from 'react';
// import XLSX from 'xlsx'; // Import XLSX library
import './transactions.css';

import Expenses from '../firebaseAPI/expense';
import Header from '../components/header';
import LeftPanel from '../components/panel';

function Transactions() {
    const [transactionsByMonth, setTransactionsByMonth] = useState({});
    const [allT, setT] = useState([]);

    useEffect(() => {
        const exp = new Expenses();

        exp.getAllTransactions().then(transactions => {
            const transactionsWithDate = transactions.map(transaction => {
                // Convert server timestamp to JavaScript Date object
                const date = new Date(transaction.time); // Assuming time is a Firebase server timestamp
                return { ...transaction, date };
            });
            setT(transactionsWithDate);
            // Group transactions by month
            const transactionsGroupedByMonth = transactionsWithDate.reduce((acc, transaction) => {
                // const month = `${transaction.date.getFullYear()}-${(transaction.date.getMonth() + 1).toString().padStart(2, '0')}`;
                const month = transaction.date.toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long' });
                if (!acc[month]) {
                    acc[month] = {
                        transactions: [],
                        total: 0
                    };
                }
                acc[month].transactions.push(transaction);
                if (transaction.type === "debited")
                    acc[month].total -= parseFloat(transaction.amount);
                else
                acc[month].total += parseFloat(transaction.amount);
                return acc;
            }, {});

            setTransactionsByMonth(transactionsGroupedByMonth);
        });
    }, []);

    return (
        <div className="dashboard">
            <Header title={"Transaction history"} />
            <div className='main'>
                <LeftPanel />
                <div className="container">

                    {/* <button id="export-button" className="button" onClick={() => exportToExcel()}>Export as EXCEL</button>
                    <button id="analysis-button" className="button" onClick={() => window.location.href = 'analysis.html'}>Transaction Analysis</button> */}
                    <ul id="transaction-list">
                        {Object.entries(transactionsByMonth).map(([month, data]) => (
                            <React.Fragment key={month}>
                                <li>
                                    <div className="monthlyTransaction">
                                        <div>
                                            <span>{month}</span>
                                        </div>
                                        <div className={`total ${data.total < 0 ? 'negative-amount' : 'positive-amount'}`}>{data.total.toFixed(2)}</div>
                                    </div>
                                </li>
                                {data.transactions.map(transaction => (
                                    <li key={transaction.id}>
                                        <div className="transaction">
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%', fontSize: '2vh' }}>
                                                <div style={{ display: 'flex', flexGrow: '1' }}>{transaction.category}</div><div className="date">
                                                    {transaction.date.toLocaleString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</div>


                                                <br />
                                            </div>
                                            <div className={`amount ${transaction.type === "debited" ? 'negative-amount' : 'positive-amount'}`}>{parseFloat(transaction.amount).toFixed(2)}</div>
                                        </div>
                                        <div className="date">{transaction.remark.toString()}</div>
                                    </li>
                                ))}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );

    function exportToExcel() {
        // const wb = XLSX.utils.book_new();
        // const ws = XLSX.utils.json_to_sheet(allT);
        // XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        // XLSX.writeFile(wb, 'transactions.xlsx');
    }
}

export default Transactions;
