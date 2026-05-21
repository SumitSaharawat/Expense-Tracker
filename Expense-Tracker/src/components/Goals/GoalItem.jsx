import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const GoalItem = ({ goal, onUpdateSaved, deleteGoal }) => {
    // Each goal card now has its own private states
    const [showInput, setShowInput] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState("");
    const [error, setError] = useState("");

    const handleAdd = () => {
        if (!amountToAdd) return;

        // Validate before updating
        if (goal.saved + Number(amountToAdd) > goal.amount) {
            setError("Amount exceeds goal amount");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setError(""); // Clear any previous errors
        onUpdateSaved(goal._id, Number(amountToAdd));
        setAmountToAdd(""); // Clear input
        setShowInput(false); // Close mini-form
    };

    const progress = Math.min((goal.saved / goal.amount) * 100, 100).toFixed(0);

    return (
        <div className="goal-card">
            <div className="goal-header">
                <span className="goal-name">{goal.name}</span>
                <span className="goal-amount">₹{goal.saved} / ₹{goal.amount}</span>
            </div>

            {/* Progress Bar Container */}
            <div className="progress-container" style={{ background: '#eee', borderRadius: '10px', height: '12px', margin: '10px 0', overflow: 'hidden' }}>
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progress}%`, background: '#44E610', height: '100%', transition: 'width 0.3s ease' }}
                >
                </div>
            </div>

            <div className="goal-body">
                <p className="goal-note">{goal.note}</p>
                <div className="goal-footer">
                    <span className="goal-date">{new Date(goal.date).toLocaleDateString()}</span>
                    <button className="btn-delete" onClick={() => deleteGoal(goal._id)} title="Delete Goal">
                        <FaTrash />
                    </button>
                    
                    <div className="add-funds-section">
                        {showInput && (
                            <input 
                                type="number" 
                                className="mini-input"
                                placeholder="Amount"
                                value={amountToAdd}
                                onChange={(e) => {
                                    setAmountToAdd(e.target.value);
                                    setError(""); // Clear error when user types
                                }}
                            />
                        )}
                        {goal.saved < goal.amount ? 
                        <button 
                            className="btn-small" 
                            onClick={showInput ? handleAdd : () => setShowInput(true)}
                        >
                            {showInput ? "Confirm" : "Add Funds"}
                        </button> : <span>Goal Reached!</span>}
                        {showInput && <button className="btn-cancel-small" onClick={() => setShowInput(false)}>X</button>}
                    </div>
                </div>
                {error && <span className="goal-error">{error}</span>}
            </div>
        </div>
    );
};

export default GoalItem;