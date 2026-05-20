import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTransactions } from './Context/TransactionContext';

// Register the necessary Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
    const { getCategoryTotal } = useTransactions();

    const data = {
        labels: ['Entertainment', 'Food', 'Utilities', 'Transport', 'Housing', 'Other'],
        datasets: [
            {
                label: ' Spendings (₹)',
                data: [
                    getCategoryTotal('Entertainment'),
                    getCategoryTotal('Food'),
                    getCategoryTotal('Utilities'),
                    getCategoryTotal('Transport'),
                    getCategoryTotal('Housing'),
                    getCategoryTotal('Other')
                ],
                backgroundColor: [
                    '#6f42c1', // Entertainment (Purple)
                    '#28a745', // Food (Green)
                    '#007bff', // Utilities (Blue)
                    '#e83e8c', // Transport (Pink)
                    '#ffc107', // Housing (Yellow)
                    '#6c757d'  // Other (Grey)
                ],
                borderColor: '#121212', // Matches your dark theme background
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: '#ddd', // Light text for dark theme
                    padding: 15
                }
            }
        }
    };

    // Only render the chart if there are actual spendings
    const totalSpendings = data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
    if (totalSpendings === 0) return null;

    return (
        <div className="chart-container">
            <h3 className="chart-title">Spendings Breakdown</h3>
            <Pie data={data} options={options} />
        </div>
    );
};

export default CategoryChart;