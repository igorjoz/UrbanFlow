import NodeCache from 'node-cache';
import axios from 'axios';

interface ZtmStop {
  stopId: number;
  stopCode: string;
  stopName: string;
  stopShortName: string;
  stopDesc: string;
  subName: string;
  date: string;
  zoneId: number;
  zoneName: string;
  virtual: number;
  nonpassenger: number;
  depot: number;
  ticketZoneBorder: number;
  onDemand: number;
  activationDate: string;
  stopLat: number;
  stopLon: number;
}

// New format: API returns object with dates as keys
// Each date contains { lastUpdate: string, stops: ZtmStop[] }
interface DateStopsData {
  lastUpdate: string;
  stops: ZtmStop[];
}

type StopsResponse = Record<string, DateStopsData>;

class StopsCacheService {
  private cache: NodeCache;
  private readonly CACHE_KEY = 'ztm_stops';
  private readonly STOPS_URL = 'https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json';
  private readonly TTL_SECONDS = 24 * 60 * 60; // 24 hours
  private isLoading = false;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: this.TTL_SECONDS,
      checkperiod: 600, // Check for expired keys every 10 minutes
    });
  }

  async getStops(): Promise<ZtmStop[]> {
    // Try to get from cache first
    const cachedStops = this.cache.get<ZtmStop[]>(this.CACHE_KEY);
    if (cachedStops) {
      console.log('✅ Returning stops from cache');
      return cachedStops;
    }

    // Fetch from API if not in cache
    return this.fetchAndCacheStops();
  }

  async searchStops(query: string): Promise<ZtmStop[]> {
    const stops = await this.getStops();
    const lowerQuery = query.toLowerCase();
    
    return stops.filter(stop => 
      stop.stopName.toLowerCase().includes(lowerQuery) ||
      stop.stopCode?.toLowerCase().includes(lowerQuery) ||
      stop.stopDesc?.toLowerCase().includes(lowerQuery)
    ).slice(0, 50); // Limit results
  }

  async getStopById(stopId: number): Promise<ZtmStop | undefined> {
    const stops = await this.getStops();
    return stops.find(stop => stop.stopId === stopId);
  }

  private async fetchAndCacheStops(): Promise<ZtmStop[]> {
    // Prevent multiple simultaneous fetches
    if (this.isLoading) {
      console.log('⏳ Already loading stops, waiting...');
      await this.waitForCache();
      const cached = this.cache.get<ZtmStop[]>(this.CACHE_KEY);
      if (cached) return cached;
    }

    this.isLoading = true;
    console.log('🔄 Fetching stops from ZTM API...');

    try {
      const response = await axios.get<StopsResponse>(this.STOPS_URL, {
        timeout: 30000, // 30 second timeout
      });

      // New format: response.data is an object with date keys
      // Find today's date or the first available date
      const data = response.data;
      const dateKeys = Object.keys(data).sort();
      
      // Use today's date if available, otherwise use the first date
      const today = new Date().toISOString().split('T')[0];
      const dateKey = dateKeys.includes(today) ? today : dateKeys[0];
      
      if (!dateKey || !data[dateKey]) {
        console.error('❌ No valid date key found in API response');
        return [];
      }

      const stops = data[dateKey].stops || [];
      console.log(`📅 Using data for date: ${dateKey}, found ${stops.length} raw stops`);
      
      // Filter out virtual/non-passenger stops for cleaner data
      const filteredStops = stops.filter(stop => 
        stop.virtual !== 1 && stop.nonpassenger !== 1 && stop.stopName
      );

      this.cache.set(this.CACHE_KEY, filteredStops);
      console.log(`✅ Cached ${filteredStops.length} stops (TTL: ${this.TTL_SECONDS}s)`);

      return filteredStops;
    } catch (error) {
      console.error('❌ Failed to fetch stops from ZTM API:', error);
      throw new Error('Failed to fetch stops data from ZTM API');
    } finally {
      this.isLoading = false;
    }
  }

  private waitForCache(): Promise<void> {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!this.isLoading || this.cache.has(this.CACHE_KEY)) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  clearCache(): void {
    this.cache.del(this.CACHE_KEY);
    console.log('🗑️ Stops cache cleared');
  }

  getCacheStats() {
    return {
      keys: this.cache.keys(),
      stats: this.cache.getStats(),
    };
  }
}

// Singleton instance
export const stopsCacheService = new StopsCacheService();
export type { ZtmStop };
