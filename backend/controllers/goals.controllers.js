const goalsModel = require('../models/goals.models');

const addGoal = async (req, res) => {
    try{
        const newGoal = await goalsModel.create(req.body);
        res.status(201).json(newGoal);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteGoal = async (req, res) => {
    try{
        const goal = await goalsModel.findByIdAndDelete(req.params.id);
        if(!goal){
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(200).json({ message: 'Goal deleted successfully' });
    }catch (error){
        res.status(500).json({ message: error.message });   
    }
}

const getGoals = async (req, res) => {
    try{
        const goals = await goalsModel.find();
        res.json(goals);
    }catch (error){
        res.status(500).json({ message: error.message });
    }
}

module.exports = { addGoal, deleteGoal, getGoals };

