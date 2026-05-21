const router = require('express').Router();
const { addGoal, deleteGoal, getGoals } = require('../controllers/goals.controllers');

router.get('/goals', getGoals).post('/goals', addGoal);
router.delete('/goals/:id', deleteGoal);

module.exports = router;