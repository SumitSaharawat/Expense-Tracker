import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';


const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {

  const { user } = useAuth();

  // Fetching transactions from MongoDB backend
  const [transaction, setTransaction] = useState([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/transactions', {
            headers: { Authorization: `Bearer ${user?.token}` }
        });
        setTransaction(response.data);
        } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    if(user && user.Date){
        fetchTransactions();
    }
  }, [user]);


  // Controls the visibility of the "Add Transaction" input form
  const [showInput, setShowInput] = useState(false);
  
  // Standardized categories for transactions
  const categories = ["Entertainment", "Food", "Utilities", "Transport", "Housing", "Other"];
  
  // Added missing UI form state
  const [form, setForm] = useState(false); 

  // Helper to remove a transaction by its unique ID
  const deleteTransaction = async(idToDelete) => {
    try {
        await axios.delete(`http://localhost:8000/api/transactions/${idToDelete}`, {
            headers: { Authorization: `Bearer ${user?.token}` }
        });
    } catch (error) {
        console.error("Error deleting transaction:", error.message);
    }    
    setTransaction(transaction.filter((item) => item._id !== idToDelete));
  };

  // Helper to update a transaction's description text
  const updateText = async(id, newText) => {
      try {
          await axios.put(`http://localhost:8000/api/transactions/${id}`, { text: newText }, {
              headers: { Authorization: `Bearer ${user?.token}` }
          });
          setTransaction(transaction.map((item) => 
              item._id === id ? { ...item, text: newText } : item
          ));
      } catch (error) {
          console.error("Error updating transaction:", error.message);
      }
  };

  // Development helper: Populates the app with 100 randomized test transactions
  const seedMockData = () => {
    const mockData = [];
    const categories = ["Entertainment", "Food", "Utilities", "Transport", "Housing"];
    
    for (let i = 0; i < 100; i++) {
        mockData.push({
            money: Math.floor(Math.random() * 1000) + 50,
            text: `Mock Transaction ${i + 1}`,
            id: Date.now() + i, // Unique ID
            category: categories[Math.floor(Math.random() * categories.length)],
            notes: "Testing 100 items",
            date: new Date().toISOString().split('T')[0]
        });
    }
    
    // This updates your state AND your LocalStorage automatically via your useEffect
    setTransaction(prev => [...prev, ...mockData]);
    alert("100 Transactions added!");
};

// useEffect (() => {
//   seedMockData();
// }, [])

const getPastSevenDaysTotal = () => {
    return transaction
        // Filter for transactions that occurred within the last 7 days
        .filter(item => {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);
            return new Date(item.date) >= sevenDaysAgo;
        })
        // Sum up the filtered transactions
        .reduce((acc, item) => acc + item.money, 0);
};

// Calculate total spendings from exactly one month ago to the start of today
const getPastMonthTotal = (transaction) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneMonthAgo.setDate(1);
    oneMonthAgo.setHours(0, 0, 0, 0); 

    const oneMonthTransactions = transaction.filter(item => {
        return new Date(item.date) >= oneMonthAgo;
    })

    return oneMonthTransactions.reduce((acc, item) => acc + item.money, 0);
}

//Helper to get category spendings
const getCategoryTotal = (category) => {
    return transaction.filter(item => item.category === category).reduce((acc, item) => acc + item.money, 0);
  }

  return (
    <TransactionContext.Provider value={{ 
        transaction, setTransaction,
        showInput, setShowInput,
        form, setForm,
        categories,
        deleteTransaction,
        updateText,
        seedMockData,
        getPastSevenDaysTotal,
        getPastMonthTotal,
        getCategoryTotal
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook for easy access to the transaction context in other components
export const useTransactions = () => useContext(TransactionContext);