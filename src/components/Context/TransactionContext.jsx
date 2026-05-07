import React, { createContext, useState, useContext, useEffect } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  // Initialize transactions from local storage, or default to an empty array
  const [transaction, setTransaction] = useState(() => {
        const savedTransactions = localStorage.getItem("my_transactions");
        return savedTransactions ? JSON.parse(savedTransactions) : [];
    });

  // Controls the visibility of the "Add Transaction" input form
  const [showInput, setShowInput] = useState(false);
  
  // Standardized categories for transactions
  const categories = ["Entertainment", "Food", "Utilities", "Transport", "Housing", "Other"];
  
  // Initialize goals from local storage
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("myGoals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  
  // Initialize total monthly budget from local storage
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("myBudget");
    return saved ? JSON.parse(saved) : 0;
  });
  
  // Tracks whether the initial budget setup view should be shown
  const [budgetInput, setBudgetInput] = useState(() => {
    const savedBudgetInput = localStorage.getItem("myBudgetInput");
    return savedBudgetInput !== null ? JSON.parse(savedBudgetInput) : true;
  });
 
  // Derived state: Calculate total expense and remaining budget based on current transactions
  const totalExpense = transaction.reduce((acc, item) => acc + item.money , 0);
  const currentBudget = (budget - totalExpense <= 0) ? 0 : (budget - totalExpense);

  // Helper to remove a transaction by its unique ID
  const deleteTransaction = (idToDelete) => {
        setTransaction(transaction.filter((item) => item.id !== idToDelete));
  };

  // Helper to update a transaction's description text
  const updateText = (id, newText) => {
        setTransaction(transaction.map((item) => 
            item.id === id ? { ...item, text: newText } : item
        ));
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

const getPastSevenDaysTotal = transaction
    // Filter for transactions that occurred within the last 7 days
    .filter(item => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        return new Date(item.date) >= sevenDaysAgo;
    })
    // Sum up the filtered transactions
    .reduce((acc, item) => acc + item.money, 0);

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

// Automatically sync state changes to localStorage to persist data across page reloads
useEffect(() => {
        localStorage.setItem("my_transactions", JSON.stringify(transaction));
        localStorage.setItem("myBudgetInput", JSON.stringify(budgetInput));
        localStorage.setItem("myBudget", JSON.stringify(budget));
        localStorage.setItem("myGoals", JSON.stringify(goals));
    }, [transaction, budgetInput, budget, goals]);


  return (
    <TransactionContext.Provider value={{ 
        transaction, setTransaction,
        goals, setGoals,
        budget, setBudget,
        showInput, setShowInput,
        budgetInput, setBudgetInput,
        categories,
        totalExpense,
        currentBudget,
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