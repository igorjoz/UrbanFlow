import { Router, Request, Response } from 'express';
import { delaysService } from '../services/delays.service';
import { StopId } from '../value-objects';

const router = Router();

/**
 * @swagger
 * /api/delays/{stopId}:
 *   get:
 *     summary: Get real-time delays for a stop
 *     tags: [Delays]
 *     parameters:
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ZTM Stop ID
 *     responses:
 *       200:
 *         description: List of delays for the stop
 *       400:
 *         description: Invalid stop ID
 *       500:
 *         description: Failed to fetch delays
 */
router.get('/:stopId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { stopId } = req.params;

    // Validate stop ID using Value Object
    let validatedStopId: StopId;
    try {
      validatedStopId = new StopId(stopId);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
      return;
    }

    const delays = await delaysService.getDelaysForStop(validatedStopId.getValue());

    res.json({
      stopId: validatedStopId.getValue(),
      count: delays.length,
      delays,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching delays:', error);
    res.status(500).json({ error: 'Failed to fetch delays' });
  }
});

export default router;
