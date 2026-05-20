import { useState } from "react";
import { useTransactions } from "./Context/TransactionContext";
import '../styles/BalanceSummary.css';
import CategoryChart from "./CategoryChart";

const BudgetInitialization = () => {

    const {budget, setBudget, setForm, budgetInput, setBudgetInput, currentBudget, 
           totalExpense, showInput, setShowInput, transaction, 
           getPastSevenDaysTotal, getPastMonthTotal, getCategoryTotal } = useTransactions();

    const percentage = (currentBudget / budget) * 100;
    const handleWarning = () => {
        if(percentage < 50){
            return "danger";
        }
        else if(percentage < 75){
            return "warning";
        }
        else{
            return "success";
        }
    }


    const handleForms = () => {
        setBudgetInput(false)
        setForm(true)
    }
    return(
        <>
            {budgetInput ? (
                <div className="budget-setup-container">
                    <h2 className="budget-setup-title">Welcome! Set your Monthly Budget</h2>
                    
                    <input 
                        type="number"
                        className="budget-input"
                        placeholder="Enter amount"
                        onChange={(e) => setBudget(e.target.value)}
                    />
                    
                    <button 
                        className="btn-primary full-width" 
                        style={{ maxWidth: '300px' }}
                        onClick={() => {
                            if(budget > 0) handleForms();
                            else alert("Please enter a valid budget");
                        }}
                    >
                        Save & Start Tracking
                    </button>
                </div>
            ) : (
                <>
                    <div className="summary-container">
                        <div className="balance-row">
                            <span className="balance-text">
                                Budget: ₹<span className={`text-${handleWarning()}`}>{currentBudget}</span>
                            </span>
                            <span className="balance-text">Expense: ₹{totalExpense}</span>
                        </div>
                        {currentBudget === 0 ? <span className="error-message">No Budget Left!</span> :
                            <button 
                            className="btn-summary" 
                            onClick={() => setShowInput(!showInput)}
                            >
                            {showInput ? "Cancel" : "Add Transaction"}
                            </button>}
                        </div>
                    {!showInput && (
                    <>
                    <div className="stats-container">
                        <div className="stat-card">
                            <span className="stat-title">Weekly Spendings</span>
                            <span className="stat-value">₹{getPastSevenDaysTotal}</span>
                        </div>
                        <CategoryChart />
                        <div className="stat-card">
                            <span className="stat-title">Monthly Spendings</span>
                            <span className="stat-value">₹{getPastMonthTotal(transaction)}</span>
                        </div>
                    </div>
                    </>)}
                </>
            )}
        </>
    )
}

export default BudgetInitialization;