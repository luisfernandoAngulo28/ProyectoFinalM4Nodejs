import express from 'express';
import reportsController from '../controllers/reports.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Proteger todas las rutas de reportes
router.use(protect);

// Rutas de reportes
router.get('/general', reportsController.getGeneralStats);
router.get('/top-users', reportsController.getTopUsersByTasks);
router.get('/tasks-stats', reportsController.getTasksStats);
router.get('/user-progress', reportsController.getUserProgress);
router.get('/trends', reportsController.getTrendsByDate);
router.get('/inactive-users', reportsController.getInactiveUsers);
router.get('/users-comparison', reportsController.getUsersComparison);

export default router;
