import { Router } from 'express';
import taskController from '../controllers/task.controller.js';
import { 
  validateCreateTask, 
  validateUpdateTask, 
  validateTaskId,
  validateUserIdParam
} from '../middlewares/validators.js';

const router = Router();

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks);

// GET /api/tasks/user/:userId - Get tasks by user ID
router.get('/user/:userId', validateUserIdParam, taskController.getTasksByUserId);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', validateTaskId, taskController.getTaskById);

// POST /api/tasks - Create new task
router.post('/', validateCreateTask, taskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', validateUpdateTask, taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', validateTaskId, taskController.deleteTask);

export default router;
