import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './dashboard.css';
import Leftpanel from '../components/panel/index.js';
import Header from '../components/header/index.jsx';
import ScrollToTop from '../components/ScrollToTop.js';
import Expenses from '../firebaseAPI/expense.js';

const DashboardPage = () => {
    const [categories, setCategories] = useState([]);

    const [budgetData, setBudgetData] = useState({
        1: 900,
        2: 700,
        3: 300
    });

    const [expensesData, setExpensesData] = useState({
        1: 300,
        2: 200,
        3: 400
    });

    const [savings, setSavings] = useState(0);
    const [expenditures, setExpenses] = useState(0);
    const expenses = new Expenses();
    useEffect(() => {
        expenses.getCategories()
            .then(categories => {
                setCategories(categories);
                expenses.getAllTransactions().then((res) => {
                    const categorySumMap = res.reduce((acc, curr) => {
                        const { category, amount, type, ...rest } = curr;
                        const k = parseInt(amount, 10);
                        if (type !== "credited") {
                            acc[category] = (acc[category] || 0) + k;
                        }
                        return acc;
                    }, {});
                    console.log(categorySumMap);
                    setExpensesData(categorySumMap);
                }).catch((e) => {
                    console.error(e);
                })
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        expenses.getUserExpense().then((r) => setExpenses(r))
            .catch((e) => console.log(e));
        expenses.getUserSaving().then((r) => setSavings(r))
            .catch((e) => console.log(e));
    }, []);

    const chartRef = useRef(null);
    const totalBudgetRef = useRef(null);
    const totalExpensesRef = useRef(null);
    const pieChartRef = useRef(null); // Reference for the pie chart canvas
    const [showNavigation, setShowNavigation] = useState(false); // State for controlling navigation visibility

    useEffect(() => {
        if (categories.length > 0 && Object.keys(budgetData).length > 0 && Object.keys(expensesData).length > 0) {
            createBarGraph();
            createPieChart(); // Call function to create the pie chart
            updateTotalBudgetAndExpenses();
        }
    }, [categories, budgetData, expensesData]);

    const createBarGraph = () => {
        const canvas = chartRef.current;
        const ctx = canvas.getContext('2d');
    
        // Check if there's an existing chart instance
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            existingChart.destroy();
        }
    
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Extract category names and expense amounts from the expensesData map
        const labels = Object.keys(expensesData);
        const expensesValues = Object.values(expensesData);
    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Expenses',
                        data: expensesValues,
                        backgroundColor: 'rgba(170, 99, 192, 0.5)', // Red
                        borderColor: 'rgba(200, 99, 200, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };
    
    

    const updateTotalBudgetAndExpenses = () => {
        // const totalBudget = Object.values(budgetData).reduce((total, budget) => total + budget, 0);
        // const totalExpenses = Object.values(expensesData).reduce((total, expense) => total + expense, 0);
        // totalBudgetRef.current.textContent = `Total Budget: $${totalBudget}`;
        // totalExpensesRef.current.textContent = `Total Expenses: $${totalExpenses}`;
    };

    const toggleNavigation = () => { // Function to toggle navigation visibility
        setShowNavigation(!showNavigation);
    };

    // Function to create the pie chart
    const createPieChart = () => {
        const canvas = pieChartRef.current;
        const ctx = canvas.getContext('2d');
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            existingChart.destroy();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Extract category names and amounts from the expensesData map
        const categoryNames = Object.keys(expensesData);
        const categoryAmounts = Object.values(expensesData);
    
        // Calculate the total expenses
        const totalExpenses = categoryAmounts.reduce((total, amount) => total + amount, 0);
    
        // Calculate the percentage of each category's expenses
        const percentageData = categoryAmounts.map(amount => ((amount / totalExpenses) * 100).toFixed(2));
    
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categoryNames,
                datasets: [{
                    label: 'Expenses',
                    data: percentageData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)', // Red
                        'rgba(54, 162, 235, 0.5)', // Blue
                        'rgba(255, 206, 86, 0.5)' // Yellow
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom' // Adjust legend position
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const value = context.parsed.toFixed(2);
                                label += value + '%';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    };
    

    return (
        <div className='dashboard'>
            <Header title={"Dashboard"} />
            <div className='main'>
                <Leftpanel />
                <div className='right-panel'>
                    <div style={{ fontSize: "1.6vmax" }}>Expenditure</div>
                    <div className='iexn'>
                        <div className='income'>
                            <div className='iexnhd'>
                                Income
                            </div>
                            <div className='iexncontent'>
                                {`INR ${savings}`}
                            </div>
                        </div>
                        <div className='expenditure'>
                            <div className='iexnhd'>
                                Expenditure
                            </div>
                            <div className='iexncontent'>
                                {`INR ${expenditures}`}
                            </div>
                        </div>
                        <div className='net'>
                            <div className='iexnhd'>
                                Net
                            </div>
                            <div className='iexncontent'>
                                {`INR ${savings - expenditures}`}
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: "1.6vmax", width: "50%" }}>Category wise expenses</div>
                    <div className='graphs'>
                        <canvas ref={chartRef} id="barChart"  ></canvas>
                        <canvas ref={pieChartRef} id="pieChart"  ></canvas>
                    </div>

                </div>
            </div>
            <ScrollToTop />
        </div>
    );
};

export default DashboardPage;
