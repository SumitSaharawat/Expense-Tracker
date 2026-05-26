import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTransactions } from './TransactionContext';
import { useAuth } from './AuthContext';
import axios from 'axios';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { transaction } = useTransactions();
  const { user, login } = useAuth(); // Extract login from useAuth
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/goals', {
            headers: { Authorization: `Bearer ${user?.token}` }
        });
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };
    
    if (user && user.token) {
      fetchGoals();
    } else if (!user) {
      setGoals([]); // Clear goals when user logs out
      //setBudget(0);
      //setBudgetInput(true);
    }
  }, [user]);

  // 1. Single Source of Truth: Get budget directly from the authenticated user payload
  const budget = user?.budget || 0;
  // 2. Derive UI state dynamically: If budget is 0, they need to initialize it
  const budgetInput = budget === 0;

  const updateBudget = async (newAmount) => {
    try {
      const response = await axios.post('http://localhost:8000/api/user/updateBudget', { budget: Number(newAmount) }, {
          headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      // Update the global AuthContext so localStorage and React state sync instantly
      login({
        ...user,
        budget: response.data.budget
      });
    } catch (error) {
      console.error('Error updating budget:', error?.response?.data?.message || error.message);
      throw error; // Pass error to the component so it can show an alert/error banner
    }
  };
  
  // const [budget, setBudget] = useState(() => {
  //   const saved = localStorage.getItem("myBudget");
  //   return saved ? JSON.parse(saved) : 0;
  // });
  
  // const [budgetInput, setBudgetInput] = useState(() => {
  //   const savedBudgetInput = localStorage.getItem("myBudgetInput");
  //   return savedBudgetInput !== null ? JSON.parse(savedBudgetInput) : true;
  // });

  const totalExpense = transaction.reduce((acc, item) => acc + item.money , 0);
  const currentBudget = (budget - totalExpense <= 0) ? 0 : (budget - totalExpense);

  // useEffect(() => {
  //   localStorage.setItem("myBudgetInput", JSON.stringify(budgetInput));
  //   localStorage.setItem("myBudget", JSON.stringify(budget));
  // }, [budgetInput, budget]);

  return (
    <BudgetContext.Provider value={{ 
      goals, 
      setGoals, 
      budget, 
      // setBudget, 
      updateBudget, 
      budgetInput, 
      //setBudgetInput, 
      totalExpense, 
      currentBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);