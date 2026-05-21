const transactionModel = require('../models/transactions.models');

const addTransaction = async (req, res) => {
    try{
        const newTransaction = await transactionModel.create(req.body);
        res.status(201).json(newTransaction);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.find();
        res.json(transactions);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const transaction = await transactionModel.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};


const updateTransaction = async (req, res) => {
    try {
        const transaction = await transactionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(transaction);
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addTransaction, deleteTransaction, getTransactions, updateTransaction };