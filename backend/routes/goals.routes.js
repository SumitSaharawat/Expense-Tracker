const router = require('express').Router();
const { addGoal, deleteGoal, updateGoal, getGoals } = require('../controllers/goals.controllers');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);


router.get('/goals', getGoals).post('/goals', addGoal);
router.delete('/goals/:id', deleteGoal).put('/goals/:id', updateGoal);

module.exports = router;