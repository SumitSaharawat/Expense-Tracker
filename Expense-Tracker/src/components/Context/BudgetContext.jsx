import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTransactions } from './TransactionContext';
import axios from 'axios';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { transaction } = useTransactions();

  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/goals');
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };
    fetchGoals();
  }, [])
  
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("myBudget");
    return saved ? JSON.parse(saved) : 0;
  });
  
  const [budgetInput, setBudgetInput] = useState(() => {
    const savedBudgetInput = localStorage.getItem("myBudgetInput");
    return savedBudgetInput !== null ? JSON.parse(savedBudgetInput) : true;
  });

  const totalExpense = transaction.reduce((acc, item) => acc + item.money , 0);
  const currentBudget = (budget - totalExpense <= 0) ? 0 : (budget - totalExpense);

  useEffect(() => {
    localStorage.setItem("myBudgetInput", JSON.stringify(budgetInput));
    localStorage.setItem("myBudget", JSON.stringify(budget));
  }, [budgetInput, budget]);

  return (
    <BudgetContext.Provider value={{ 
      goals, 
      setGoals, 
      budget, 
      setBudget, 
      budgetInput, 
      setBudgetInput, 
      totalExpense, 
      currentBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);