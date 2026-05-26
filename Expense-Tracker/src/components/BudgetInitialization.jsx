import { useState } from "react";
import { useTransactions } from "./Context/TransactionContext";
import { useBudget } from "./Context/BudgetContext";
import '../styles/BalanceSummary.css';
import CategoryChart from "./CategoryChart";

// 1. Updated BudgetSetup to use local component state for the input field
const BudgetSetup = ({ handleBudgetSubmit, loading }) => {
    const [inputVal, setInputVal] = useState("");

    return (
        <div className="budget-setup-container">
            <h2 className="budget-setup-title">Welcome! Set your Monthly Budget</h2>
            <input 
                type="number"
                className="budget-input"
                placeholder="Enter amount"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={loading}
            />
            <button 
                className="btn-primary full-width" 
                style={{ maxWidth: '300px' }}
                disabled={loading}
                onClick={() => {
                    const parsedAmount = Number(inputVal);
                    if (parsedAmount > 0) {
                        handleBudgetSubmit(parsedAmount);
                    } else {
                        alert("Please enter a valid budget");
                    }
                }}
            >
                {loading ? "Saving..." : "Save & Start Tracking"}
            </button>
        </div>
    );
};

const BudgetSummary = ({ budget, currentBudget, totalExpense, showInput, setShowInput, handleWarning }) => (
    <div className="summary-container">
        <div className="balance-row">
            {/* Added your absolute limit next to remaining budget so user sees the context */}
            <span className="balance-text">
                Budget Left: ₹<span className={`text-${handleWarning()}`}>{currentBudget}</span> / ₹{budget}
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
    
    // 2. Extracted your updated backend elements from your context
    const { budget, updateBudget, budgetInput, currentBudget, totalExpense } = useBudget();
    const [loading, setLoading] = useState(false);

    const percentage = budget > 0 ? (currentBudget / budget) * 100 : 0;
    
    const handleWarning = () => {
        if(percentage < 50) return "danger";
        if(percentage < 75) return "warning";
        return "success";
    }

    // 3. New asynchronous handler to bridge UI to your MongoDB update route
    const handleBudgetSubmit = async (amount) => {
        setLoading(true);
        try {
            await updateBudget(amount); // Hits PUT /api/auth/update-budget
            setForm(true); // Opens up the basic form view options on success
        } catch (err) {
            alert("Failed to save budget. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {budgetInput ? (
                <BudgetSetup handleBudgetSubmit={handleBudgetSubmit} loading={loading} />
            ) : (
                <>
                    <BudgetSummary 
                        budget={budget}
                        currentBudget={currentBudget} 
                        totalExpense={totalExpense} 
                        showInput={showInput} 
                        setShowInput={setShowInput} 
                        handleWarning={handleWarning} 
                    />
                        
                    {!showInput && (
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
                    )}
                </>
            )}
        </>
    )
}

export default BudgetInitialization;