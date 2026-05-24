const router = require('express').Router();
const {addTransaction, deleteTransaction, getTransactions, updateTransaction} = require('../controllers/transactions.controllers');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/transactions', getTransactions).post('/transactions', addTransaction);
router.delete('/transactions/:id', deleteTransaction).put('/transactions/:id', updateTransaction);

module.exports = router;