const express = require('express');
const { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask,
  toggleTaskStatus 
} = require('../controllers/tasks');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(createTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/toggle').put(toggleTaskStatus);

module.exports = router;
