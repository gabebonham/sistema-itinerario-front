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

function getAttemptsFor(itineraryId: string, max = 3) {
  return ATTEMPT_MOCKS.filter(a => a.itineraryId === itineraryId).slice(0, max);
}

export const MOCK_ITINERARY_LIST: Itinerary[] = [
  {
    id: 'IT-01-CT-006',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e001',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d004',
    createdAt: new Date('2023-01-04T13:10:00.000Z'),
    updatedAt: new Date('2023-01-06T09:30:00.000Z'),
    attempts: getAttemptsFor('IT-01-CT-006'),
  },
  {
    id: 'IT-03-CT-018',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e002',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d016',
    createdAt: new Date('2023-01-16T11:00:00.000Z'),
    updatedAt: new Date('2023-01-18T08:50:00.000Z'),
    attempts: getAttemptsFor('IT-03-CT-018'),
  },
  {
    id: 'f47ac10b-58cc-0003-a567-0e02b2c3d003',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e003',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d003',
    createdAt: new Date('2023-01-01T09:00:00.000Z'),
    updatedAt: new Date('2023-01-05T11:00:00.000Z'),
    attempts: getAttemptsFor('f47ac10b-58cc-0003-a567-0e02b2c3d003'), // 2 attempts (d001, d003)
  },
  {
    id: 'IT-03-CT-004',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e004',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d002',
    createdAt: new Date('2023-01-02T10:15:00.000Z'),
    updatedAt: new Date('2023-01-04T16:45:00.000Z'),
    attempts: getAttemptsFor('IT-03-CT-004'),
  },
  {
    id: 'IT-01-CT-007',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e005',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d005',
    createdAt: new Date('2023-01-05T07:50:00.000Z'),
    updatedAt: new Date('2023-01-07T15:20:00.000Z'),
    attempts: getAttemptsFor('IT-01-CT-007'),
  },
  {
    id: 'IT-02-CT-008',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e006',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d006',
    createdAt: new Date('2023-01-06T12:00:00.000Z'),
    updatedAt: new Date('2023-01-08T17:10:00.000Z'),
    attempts: getAttemptsFor('IT-02-CT-008'),
  },
  {
    id: 'IT-03-CT-009',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e007',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d007',
    createdAt: new Date('2023-01-07T09:40:00.000Z'),
    updatedAt: new Date('2023-01-09T10:05:00.000Z'),
    attempts: getAttemptsFor('IT-03-CT-009'),
  },
  {
    id: 'IT-01-CT-010',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e008',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d008',
    createdAt: new Date('2023-01-08T11:25:00.000Z'),
    updatedAt: new Date('2023-01-10T13:50:00.000Z'),
    attempts: getAttemptsFor('IT-01-CT-010'),
  },
  {
    id: 'IT-02-CT-011',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e009',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d009',
    createdAt: new Date('2023-01-09T08:15:00.000Z'),
    updatedAt: new Date('2023-01-11T16:00:00.000Z'),
    attempts: getAttemptsFor('IT-02-CT-011'),
  },
  {
    id: 'IT-01-CT-012',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e010',
    lastAttemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d010',
    createdAt: new Date('2023-01-10T10:30:00.000Z'),
    updatedAt: new Date('2023-01-12T09:15:00.000Z'),
    attempts: getAttemptsFor('IT-01-CT-012'),
  },
];
@Injectable({ providedIn: 'root' })
export class ItineraryService {

  async getLastAttempts(page: number, pageSize: number): Promise<{ data: Attempt[], total: number, page: number, pageSize: number, hasNext: boolean, hasPrevious: boolean }> {
    const total = ATTEMPT_MOCKS.length;

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
    return { success: true, data: ATTEMPT_MOCKS.filter(att => att.itineraryId == MOCK_ITINERARY.id) };
  }
  async getAllPaginated(page: number, pageSize: number): Promise<{ data: Itinerary[], total: number, page: number, pageSize: number, hasNext: boolean, hasPrevious: boolean }> {
    const total = MOCK_ITINERARY_LIST.length;

    // fatia o mock pra simular paginação de verdade
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = MOCK_ITINERARY_LIST.slice(start, end);

    return {
      data,
      total,
      page,
      pageSize,
      hasNext: page * pageSize < total,
      hasPrevious: page > 1
    };
  }
}