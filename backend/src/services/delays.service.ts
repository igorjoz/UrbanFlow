import axios from 'axios';

interface ZtmDeparture {
  id: string;
  delayInSeconds: number | null;
  estimatedTime: string;
  headsign: string;
  routeId: number;
  routeShortName: string;
  tripId: number;
  status: string;
  theoreticalTime: string;
  timestamp: string;
  trip: number;
  vehicleCode: number | null;
  vehicleId: number | null;
  vehicleService: string;
  scheduledTripStartTime: string;
}

interface ZtmDeparturesResponse {
  lastUpdate: string;
  departures: ZtmDeparture[];
}

interface FormattedDelay {
  id: string;
  routeId: number;
  routeShortName: string;
  headsign: string;
  theoreticalTime: string;
  estimatedTime: string;
  delayInSeconds: number;
  delayFormatted: string;
  status: string;
  vehicleCode: number | null;
}

class DelaysService {
  private readonly BASE_URL = 'https://ckan2.multimediagdansk.pl/departures';

  async getDelaysForStop(stopId: number): Promise<FormattedDelay[]> {
    try {
      const response = await axios.get<ZtmDeparturesResponse>(`${this.BASE_URL}?stopId=${stopId}`, {
        timeout: 10000, // 10 second timeout
      });

      const departures = response.data.departures || [];
      
      return departures.map(departure => this.formatDelay(departure));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('ZTM API request timeout');
        }
        if (error.response?.status === 404) {
          return []; // No data for this stop
        }
      }
      console.error('❌ Failed to fetch departures:', error);
      throw new Error('Failed to fetch departures from ZTM API');
    }
  }

  private formatDelay(departure: ZtmDeparture): FormattedDelay {
    return {
      id: departure.id,
      routeId: departure.routeId,
      routeShortName: departure.routeShortName,
      headsign: departure.headsign,
      theoreticalTime: departure.theoreticalTime,
      estimatedTime: departure.estimatedTime,
      delayInSeconds: departure.delayInSeconds ?? 0,
      delayFormatted: this.formatDelayTime(departure.delayInSeconds),
      status: departure.status,
      vehicleCode: departure.vehicleCode,
    };
  }

  private formatDelayTime(seconds: number | null): string {
    if (seconds === null || seconds === 0) {
      return 'Punktualnie';
    }
    
    const absSeconds = Math.abs(seconds);
    const minutes = Math.floor(absSeconds / 60);
    const remainingSeconds = absSeconds % 60;

    let timeStr = '';
    if (minutes > 0) {
      timeStr = `${minutes} min`;
      if (remainingSeconds > 0) {
        timeStr += ` ${remainingSeconds} s`;
      }
    } else {
      timeStr = `${remainingSeconds} s`;
    }

    return seconds > 0 ? `+${timeStr}` : `-${timeStr}`;
  }
}

// Singleton instance
export const delaysService = new DelaysService();
export type { FormattedDelay, ZtmDeparture };
