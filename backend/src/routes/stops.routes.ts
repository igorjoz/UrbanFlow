import { Router, Request, Response } from 'express';
import { stopsCacheService } from '../services/stops-cache.service';

const router = Router();

/**
 * @swagger
 * /api/stops:
 *   get:
 *     summary: Get all ZTM stops (cached)
 *     tags: [Stops]
 *     responses:
 *       200:
 *         description: List of all stops
 *       500:
 *         description: Failed to fetch stops
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const stops = await stopsCacheService.getStops();
    res.json({
      count: stops.length,
      stops,
    });
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
});

/**
 * @swagger
 * /api/stops/search:
 *   get:
 *     summary: Search stops by name
 *     tags: [Stops]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching stops
 *       400:
 *         description: Query parameter required
 */
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.length < 2) {
      res.status(400).json({ error: 'Query must be at least 2 characters long' });
      return;
    }

    const stops = await stopsCacheService.searchStops(query);
    res.json({
      query,
      count: stops.length,
      stops,
    });
  } catch (error) {
    console.error('Error searching stops:', error);
    res.status(500).json({ error: 'Failed to search stops' });
  }
});

/**
 * @swagger
 * /api/stops/{stopId}:
 *   get:
 *     summary: Get stop by ID
 *     tags: [Stops]
 *     parameters:
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stop ID
 *     responses:
 *       200:
 *         description: Stop details
 *       404:
 *         description: Stop not found
 */
router.get('/:stopId', async (req: Request, res: Response): Promise<void> => {
  try {
    const stopId = parseInt(req.params.stopId, 10);
    
    if (isNaN(stopId)) {
      res.status(400).json({ error: 'Invalid stop ID' });
      return;
    }

    const stop = await stopsCacheService.getStopById(stopId);
    
    if (!stop) {
      res.status(404).json({ error: 'Stop not found' });
      return;
    }

    res.json({ stop });
  } catch (error) {
    console.error('Error fetching stop:', error);
    res.status(500).json({ error: 'Failed to fetch stop' });
  }
});

/**
 * @swagger
 * /api/stops/cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     tags: [Stops]
 *     responses:
 *       200:
 *         description: Cache statistics
 */
router.get('/cache/stats', (req: Request, res: Response): void => {
  const stats = stopsCacheService.getCacheStats();
  res.json(stats);
});

export default router;
