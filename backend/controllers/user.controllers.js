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
        res.status(200).json({email, token});
    }catch (error){
        res.status(400).json({error: error.message});
    }
}

const signup = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.signup(email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token});
    }catch (error){
        res.status(400).json({error: error.message});
    }
}

module.exports = { login, signup };