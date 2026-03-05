import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { 
  validateCreateUser, 
  validateUpdateUser, 
  validateUserId,
  validatePagination 
} from '../middlewares/validators.js';

const router = Router();

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/list/pagination - Get users with pagination
router.get('/list/pagination', validatePagination, userController.getUsersPagination);

// GET /api/users/:id/tasks - Get user with their tasks
router.get('/:id/tasks', validateUserId, userController.getUserWithTasks);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateUserId, userController.getUserById);

// POST /api/users - Create new user
router.post('/', validateCreateUser, userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validateUpdateUser, userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', validateUserId, userController.deleteUser);

export default router;