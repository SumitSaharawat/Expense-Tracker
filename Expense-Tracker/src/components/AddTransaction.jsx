import { useState } from "react";
import { useTransactions } from "./Context/TransactionContext";
import { useBudget } from "./Context/BudgetContext";
import axios from "axios";
import "../styles/AddTransaction.css"

const AddTransaction = () => {

  const { transaction, setTransaction, showInput, setShowInput, categories } = useTransactions();
  const { budget, totalExpense } = useBudget();

  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleTransaction = async(formdata) => {
    setError(""); // Clear any previous errors

    if (!amount || !category) {
        setError("Please enter an amount and select a category.");
        return; 
    }
    if (totalExpense + Number(amount) > budget) {
        setError("Not Enough Funds! Transaction exceeds your budget.");
        return;
    }

    try {
        const response = await axios.post('http://localhost:8000/api/transactions', {
            money: Number(amount),
            text: detail,
            category: category,
            notes: notes,});
            setTransaction([...transaction, response.data]);
        } catch (error){
            console.error("Error adding transaction:", error.message);
        }
    
    // Reset form
    setAmount("");
    setDetail("");
    setCategory("");
    setError("");
    setShowInput(false);
  };

  return (
    <>
            {showInput && (
                <div className="transaction-container">
                    <div className="form-content">
                        <input
                            className="input-field"
                            type="number"
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError(""); // Clear error when user types
                            }}
                        />

                        <input
                            className="input-field"
                            type="text"
                            placeholder="Enter Details"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                        />

                        <input
                            className="input-field"
                            type="text"
                            placeholder="Add any Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <div style={{ textAlign: 'left', fontSize: "14px", fontWeight: "bold", color: "#ddd"}}>
                            Select Category
                        </div>

                        <div className="category-wrapper">
                            {categories.map((cat) => (
                            <div
                                key={cat}
                                className={`chip ${category === cat ? "active" : ""}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </div>
                            ))}
                        </div>

                        {error && (
                            <div style={{ color: '#ff4d4d', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}
                        <button className="btn-primary full-width" onClick={handleTransaction}>
                            Add Transaction
                        </button>
                    </div>
                </div>
            )}
    </>
  );
};

export default AddTransaction;