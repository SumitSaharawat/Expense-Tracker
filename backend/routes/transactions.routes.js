const router = require('express').Router();
const {addTransaction, deleteTransaction, getTransaction, getTransactions, updateTransaction} = require('../controllers/transactions.controllers');

router.get('/transactions', getTransactions).post('/transactions', addTransaction);
router.delete('/transactions/:id', deleteTransaction).put('/transactions/:id', updateTransaction).get('/transactions/:id', getTransaction);

module.exports = router;