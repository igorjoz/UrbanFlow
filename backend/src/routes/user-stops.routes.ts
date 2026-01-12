import { Router, Response } from 'express';
import { UserStop } from '../models/UserStop';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';
import { StopId, StopName } from '../value-objects';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/user/stops:
 *   get:
 *     summary: Get all stops for current user
 *     tags: [User Stops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's saved stops
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const stops = await UserStop.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
    });

    res.json({ stops });
  } catch (error) {
    console.error('Error fetching user stops:', error);
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
});

/**
 * @swagger
 * /api/user/stops:
 *   post:
 *     summary: Add a new stop for current user
 *     tags: [User Stops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stopId
 *               - stopName
 *             properties:
 *               stopId:
 *                 type: integer
 *               stopName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stop added successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Stop already added
 */
router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { stopId, stopName } = req.body;

    // Validate using Value Objects
    let validatedStopId: StopId;
    let validatedStopName: StopName;

    try {
      validatedStopId = new StopId(stopId);
      validatedStopName = new StopName(stopName);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
      return;
    }

    // Check if stop already exists for this user
    const existingStop = await UserStop.findOne({
      where: {
        userId: req.userId,
        stopId: validatedStopId.getValue(),
      },
    });

    if (existingStop) {
      res.status(409).json({ error: 'This stop is already in your list' });
      return;
    }

    // Create the stop
    const stop = await UserStop.create({
      userId: req.userId!,
      stopId: validatedStopId.getValue(),
      stopName: validatedStopName.getValue(),
    });

    res.status(201).json({
      message: 'Stop added successfully',
      stop,
    });
  } catch (error) {
    console.error('Error adding stop:', error);
    res.status(500).json({ error: 'Failed to add stop' });
  }
});

/**
 * @swagger
 * /api/user/stops/{id}:
 *   put:
 *     summary: Update a saved stop
 *     tags: [User Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stopName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stop updated successfully
 *       404:
 *         description: Stop not found
 */
router.put('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { stopName } = req.body;

    const stop = await UserStop.findOne({
      where: {
        id: parseInt(id, 10),
        userId: req.userId,
      },
    });

    if (!stop) {
      res.status(404).json({ error: 'Stop not found' });
      return;
    }

    // Validate using Value Object
    if (stopName) {
      try {
        const validatedStopName = new StopName(stopName);
        stop.stopName = validatedStopName.getValue();
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
        return;
      }
    }

    await stop.save();

    res.json({
      message: 'Stop updated successfully',
      stop,
    });
  } catch (error) {
    console.error('Error updating stop:', error);
    res.status(500).json({ error: 'Failed to update stop' });
  }
});

/**
 * @swagger
 * /api/user/stops/{id}:
 *   delete:
 *     summary: Delete a saved stop
 *     tags: [User Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stop deleted successfully
 *       404:
 *         description: Stop not found
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const stop = await UserStop.findOne({
      where: {
        id: parseInt(id, 10),
        userId: req.userId,
      },
    });

    if (!stop) {
      res.status(404).json({ error: 'Stop not found' });
      return;
    }

    await stop.destroy();

    res.json({ message: 'Stop deleted successfully' });
  } catch (error) {
    console.error('Error deleting stop:', error);
    res.status(500).json({ error: 'Failed to delete stop' });
  }
});

export default router;
