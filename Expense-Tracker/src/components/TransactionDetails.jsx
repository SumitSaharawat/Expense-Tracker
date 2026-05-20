import { useState } from "react";
import EditTransaction from "./EditTransaction";
import "../styles/TransactionDetails.css"; 
import { useTransactions } from "./Context/TransactionContext";

const TransactionDetails = () => {

    const { transaction, deleteTransaction, updateText, form } = useTransactions();
    const [searchInput, setSearchInput] = useState("");
    const [selected, setSelected] = useState("");
    const [filter, setFilter] = useState("");


    const filteredTransaction = transaction
        .filter((item) => item.text.toLowerCase().includes(searchInput.toLowerCase())).filter((item) => {
            if (filter === "") return true;
            return item.category.toLowerCase() === filter.toLowerCase();
        }).sort((a, b) => {
            if (selected === "highToLow") return b.money - a.money;
            if (selected === "lowTohigh") return a.money - b.money;
            // Date Logic: Newest to Oldest
            if (selected === "newest") {
                return new Date(b.date) - new Date(a.date);
            }
            // Date Logic: Oldest to Newest
            if (selected === "oldest") {
                return new Date(a.date) - new Date(b.date);
            }
            return 0;
        });

    return (
        <>
            
            <div className="details-container">
                <div className="details-header-row">
                    <h2 className="details-heading">Transactions</h2>
                    <h3 className="transactions-count">{filteredTransaction.length} of {transaction.length} Transactions</h3>
                </div>

                <div className="controls-row">
                    <div className="search-wrapper">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search transactions..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />

                        <button className="search-icon-btn" aria-label="Search">
                            <svg 
                                width="20" height="20" viewBox="0 0 24 24" fill="none" 
                                stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>

                    <select className="sort-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="" disabled>Select a Category</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="housing">Housing</option>
                        <option value="utilities">Utilities</option>
                        <option value="transport">Transport</option>
                        <option value="food">Food</option>
                        <option value="other">Other</option>
                    </select>

                    <select className="sort-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
                        <option value="" disabled>Select an option</option>
                        <option value="highToLow">HighToLow</option>
                        <option value="lowTohigh">LowToHigh</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>


                {filteredTransaction.map((item) => (
                    <EditTransaction 
                        key={item.id} 
                        transaction={item} 
                        deleteTransaction={deleteTransaction} 
                        updateText={updateText}
                    />
                ))}
                
                {filteredTransaction.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                        No matches found.
                    </p>
                )}
            </div>
            
        </>
    );
};

export default TransactionDetails;