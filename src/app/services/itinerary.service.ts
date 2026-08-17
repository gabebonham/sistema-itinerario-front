import { Injectable } from "@angular/core";
import { Attempt } from "../models/attempt";
import { ATTEMPT_MOCKS } from "./attempts.service";
import { CreateItineraryDTO } from "../DTOS/create-itinerary.dto";
import { Itinerary } from "../models/itinerary";
export const MOCK_ITINERARY: Itinerary = {
  id: 'f47ac10b-58cc-0003-a567-0e02b2c3d003',
  createdAt: new Date(),
  updatedAt: new Date(),
  debtorId: 'f47ac10b-fs87-0003-a567-0e02b2c3d003',
  lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d003'
}

@Injectable({ providedIn: 'root' })
export class ItineraryService {

  async getLastAttempts(page: number, pageSize: number): Promise<{ data: Attempt[], total: number, page: number, pageSize: number, hasNext: boolean, hasPrevious: boolean }> {
    const total = 24;

    // fatia o mock pra simular paginação de verdade
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = ATTEMPT_MOCKS.slice(start, end);

    return {
      data,
      total,
      page,
      pageSize,
      hasNext: page * pageSize < total,
      hasPrevious: page > 1
    };
  }
  async create(dto: CreateItineraryDTO) {
    console.log('Itinerary created')
    console.log(JSON.stringify(dto, null, 2))
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d001' } };
  }
  async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: MOCK_ITINERARY };
  }
  async getAttemptsByItineraryId(id: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: ATTEMPT_MOCKS.filter(att=>att.itineraryId==MOCK_ITINERARY.id) };
  }
}