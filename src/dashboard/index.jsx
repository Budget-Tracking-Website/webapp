import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './dashboard.css';
import Leftpanel from './leftpanel.js';

const DashboardPage = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' }
    ]);

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

        const labels = categories.map(category => category.name);
        const budgetValues = categories.map(category => budgetData[category.id]);
        const expensesValues = categories.map(category => expensesData[category.id]);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Budget',
                        data: budgetValues,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Blue
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: expensesValues,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Red
                        borderColor: 'rgba(255, 99, 132, 1)',
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

        // Calculate the total expenses
        const totalExpenses = Object.values(expensesData).reduce((total, expense) => total + expense, 0);

        // Calculate the percentage of each category's expenses
        const percentageData = Object.values(expensesData).map(expense => ((expense / totalExpenses) * 100).toFixed(2));

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories.map(category => category.name),
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
        <div className="dashboard-container">
            <div className="top-right">
                <button className="side-panel-button" onClick={toggleNavigation}>
                    {showNavigation ? 'Hide Navigation' : 'Show Navigation'}
                </button>
            </div>
            <div className={`navigation-links ${showNavigation ? 'show' : ''}`}>
                <Leftpanel />
            </div>
            <div className="right-panel">
                <h1>Dashboard</h1>
                {/* <div className="total-budget-expenses">
                    <p ref={totalBudgetRef}></p>
                    <p ref={totalExpensesRef}></p>
                </div> */}
                <div className='iexn'>
                    <div className='income'>
                        <div className='iexnhd'>
                            Income
                        </div>
                        <div className='iexncontent'>
                            INR 5000
                        </div>
                    </div>
                    <div className='expenditure'>
                    <div className='iexnhd'>
                            Expenditure
                        </div>
                        <div className='iexncontent'>
                            INR 3000
                        </div>
                    </div>
                    <div className='net'>
                    <div className='iexnhd'>
                            Net
                        </div>
                        <div className='iexncontent'>
                            INR 2000
                        </div>
                    </div>
                </div>
                <div className='graphs'>
                    <canvas ref={chartRef} id="barChart"  ></canvas>
                    <canvas ref={pieChartRef} id="pieChart"  ></canvas>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
