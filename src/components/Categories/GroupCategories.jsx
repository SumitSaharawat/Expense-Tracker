import { useState } from "react";
import EditTransaction from "../EditTransaction";

const GroupCategories = ({ category, transactions, deleteTransaction, updateText, expense }) => {

    const [limit, setLimit] = useState(Number(3));
    const visibleTransaction = transactions.slice(0,limit);

    return(
        <>
            <div key={category} className="category-group">
                <h2 className="category-title">
                    <span>{category}</span>
                    <span className="category-total">Total: ₹{expense}</span>
                </h2>
                
                <ul className="category-transaction-list">
                    {visibleTransaction.length > 0 && visibleTransaction.map((item) => (
                        <EditTransaction 
                            key={item.id} 
                            transaction={item} 
                            deleteTransaction={deleteTransaction} 
                            updateText={updateText}
                        />
                    ))}
                    <div className="view-buttons-container">
                        {limit < transactions.length && <button className="view-btn" onClick={() => setLimit((prev) => (prev+3))}>View More</button>}
                        {limit > 3 && <button className="view-btn" onClick={() => setLimit((prev) => (prev > 3) ? (prev-3) : (prev))}>View Less</button>}
                    </div>
                </ul>
            </div>
        </>
    )
}

export default GroupCategories;