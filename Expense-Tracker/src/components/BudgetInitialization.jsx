import { useState } from "react";
import { useTransactions } from "./Context/TransactionContext";
import { useBudget } from "./Context/BudgetContext";
import '../styles/BalanceSummary.css';
import CategoryChart from "./CategoryChart";

const BudgetSetup = ({ budget, setBudget, handleForms }) => (
    <div className="budget-setup-container">
        <h2 className="budget-setup-title">Welcome! Set your Monthly Budget</h2>
        <input 
            type="number"
            className="budget-input"
            placeholder="Enter amount"
            value={budget || ""}
            onChange={(e) => setBudget(Number(e.target.value))}
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
);

const BudgetSummary = ({ currentBudget, totalExpense, showInput, setShowInput, handleWarning }) => (
    <div className="summary-container">
        <div className="balance-row">
            <span className="balance-text">
                Budget: ₹<span className={`text-${handleWarning()}`}>{currentBudget}</span>
            </span>
            <span className="balance-text">Expense: ₹{totalExpense}</span>
        </div>
        {currentBudget === 0 ? <span className="error-message">No Budget Left!</span> :
            <button className="btn-summary" onClick={() => setShowInput(!showInput)}>
                {showInput ? "Cancel" : "Add Transaction"}
            </button>}
    </div>
);

const BudgetInitialization = () => {

    const { setForm, showInput, setShowInput, transaction, getPastSevenDaysTotal, getPastMonthTotal } = useTransactions();
    const { budget, setBudget, budgetInput, setBudgetInput, currentBudget, totalExpense } = useBudget();

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
                    <BudgetSetup budget={budget} setBudget={setBudget} handleForms={handleForms} />
            ) : (
                <>
                        <BudgetSummary currentBudget={currentBudget} totalExpense={totalExpense} showInput={showInput} setShowInput={setShowInput} handleWarning={handleWarning} />
                        
                    {!showInput && (
                    <>
                    <div className="stats-container">
                        <div className="stat-card">
                            <span className="stat-title">Weekly Spendings</span>
                                <span className="stat-value">₹{getPastSevenDaysTotal()}</span>
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