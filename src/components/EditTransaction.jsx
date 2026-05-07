import { useState } from "react";
import "../styles/EditTransaction.css"; // Import the new styles

const EditTransaction = ({ transaction, deleteTransaction, updateText }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(transaction.text);

    const handleSave = () => {
        updateText(transaction.id, newText);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNewText(transaction.text); 
        setIsEditing(false);
    };

    return (
        <li className={`transaction-item bg-${transaction.category}`}>
            {isEditing ? (
                <>
                    <input 
                        className="edit-input"
                        type="text" 
                        value={newText} 
                        onChange={(e) => setNewText(e.target.value)}
                        autoFocus
                    />
                    <div className="btn-group">
                        <button className="action-btn btn-save" onClick={handleSave}>
                            Save
                        </button>
                        <button className="action-btn btn-cancel" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="transaction-info">
                        <span>{transaction.date}</span>
                        <span>{transaction.text}</span>
                        <span>₹{transaction.money}</span>
                        <span>{transaction.notes}</span>
                    </div>
            
                    <div className="btn-group">
                        <button 
                            className="action-btn btn-edit" 
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                        <button 
                            className="action-btn btn-remove" 
                            onClick={() => deleteTransaction(transaction.id)}
                        >
                            Remove
                        </button>
                    </div>
                </>
            )}
        </li>
    );
};

export default EditTransaction;