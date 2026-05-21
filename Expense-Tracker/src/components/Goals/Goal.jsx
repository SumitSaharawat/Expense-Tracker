import { use, useState } from "react";
import './styles/Goals.css';
import GoalItem from "./GoalItem";
import { useBudget } from "../Context/BudgetContext";
import axios from "axios";

const Goals = () => {

    const { goals, setGoals } = useBudget();

    const [goalsform, setgoalsForms] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(""); 
    const [note, setNote] = useState("");


    const handleGoals = async () => {
        if (!name || !amount) return;

        try{
            const response = await axios.post('http://localhost:8000/api/goals', {
                name: name,
                amount: Number(amount),
                saved: 0,
                note: note,
                createdAt: new Date().toISOString(),
            });
            setGoals([...goals, response.data]);
        }catch (error){
            console.error("Error adding goal:", error.message);
        }
        
        setgoalsForms(false);
        // Clear form
        setName(""); setAmount(""); setNote("");
    };

    // This function targets a specific goal by ID and updates its saved total
    const updateGoalAmount = async (id, money) => {
        const goalToUpdate = goals.find(g => g._id === id);

        if (goalToUpdate && (goalToUpdate.saved + money > goalToUpdate.amount)) {
            return; // Exit early, do not update the state
        }

        try{
            await axios.put(`http://localhost:8000/api/goals/${id}`, { saved: money });
            setGoals(prevGoals => prevGoals.map(g => 
            g._id === id ? { ...g, saved: Number(g.saved) + money } : g
            ));
        } catch (error) {
            console.error("Error updating goal:", error.message);
        }   
    };

    const deleteGoal = async (id) => {
        try{
            await axios.delete(`http://localhost:8000/api/goals/${id}`);
            setGoals(goals.filter(g => g._id !== id));
        } catch (error) {
            console.error("Error deleting goal:", error.message);
        }
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
                {goals.map((goal) => (
                    <GoalItem 
                        key={goal._id} 
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