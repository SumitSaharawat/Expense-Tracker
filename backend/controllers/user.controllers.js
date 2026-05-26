const userModel = require('../models/users.models');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1d'});
}

const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.login(email, password);
        const token = createToken(user._id);    
        res.status(200).json({email, token, budget: user.budget});
    }catch (error){
        res.status(400).json({error: error.message});
    }
}

const signup = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.signup(email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token, budget: user.budget});
    }catch (error){
        res.status(400).json({error: error.message});
    }
}

const updateBudget = async (req, res) => {
    try{
        const userId = req.user._id;
        const {budget} = req.body;
        const upddatedUser = await userModel.findByIdAndUpdate(userId, 
            { budget: Number(budget) },
            { new : true });
        res.status(200).json(upddatedUser);
    }catch (error){
        res.status(400).json({error: error.message});
    }

}


module.exports = { login, signup, updateBudget };