import { use, useState } from "react";
import './styles/Goals.css';
import GoalItem from "./GoalItem";
import { useTransactions } from "../Context/TransactionContext";

const Goals = () => {

    const { goals, setGoals } = useTransactions();

    const [goalsform, setgoalsForms] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(""); 
    const [note, setNote] = useState("");


    const handleGoals = () => {
        if (!name || !amount) return;
        const newGoal = {
            name: name,
            amount: Number(amount),
            saved: 0,
            note: note,
            createdAt: new Date().toISOString(),
            id: Date.now()
        };
        setGoals([...goals, newGoal]);
        setgoalsForms(false);
        // Clear form
        setName(""); setAmount(""); setNote("");
    };

    // This function targets a specific goal by ID and updates its saved total
    const updateGoalAmount = (id, money) => {
        const goalToUpdate = goals.find(g => g.id === id);
        
        if (goalToUpdate && (goalToUpdate.saved + money > goalToUpdate.amount)) {
            return; // Exit early, do not update the state
        }

        setGoals(prevGoals => prevGoals.map(g => 
            g.id === id ? { ...g, saved: Number(g.saved) + money } : g
        ));
    };

    const deleteGoal = (id) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    return (
        <div className="goals-container">
            <button className="btn-goals" onClick={() => setgoalsForms(!goalsform)}>
                {goalsform ? "Cancel" : "Add New Goal"}
            </button>

            {goalsform && (
                <div className="goal-form-container">
                    <input className="input-field" 
                        type="number" 
                        placeholder="Target Amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} />
                    <input className="input-field" type="text" placeholder="Goal Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <textarea className="input-field" placeholder="Notes..." value={note} onChange={(e) => setNote(e.target.value)} />
                    <button className="btn-primary full-width" onClick={handleGoals}>Create Goal</button>
                </div>
            )}

            <div className="goal-list">
                {goals.map((goal, index) => (
                    <GoalItem 
                        key={goal.id || index} 
                        goal={goal} 
                        onUpdateSaved={updateGoalAmount} 
                        deleteGoal={deleteGoal}
                    />
                ))}
            </div>
        </div>
    );
};

export default Goals;