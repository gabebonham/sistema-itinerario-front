import { Injectable } from "@angular/core";
import { Diligence } from "../models/diligence";
import { DILIGENCE_MOCKS } from "./diligences.service";
import { Attempt } from "../models/attempt";
import { CreateAttemptDTO } from "../DTOS/create-itinerary.dto";
export const MOCK_ATTEMPT: Attempt = {
  id: 'f47ac10b-58cc-0003-a567-0e02b2c3d003',
  status: 'Pendente',
  createdAt: new Date(),
  updatedAt: new Date(),
  debtorId: 'f47ac10b-fs87-0003-a567-0e02b2c3d003',
  lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d003',
  concludedVisitNumber: 2,
  protocol: '123'
}

function getDiligencesFor(attemptId: string, max = 3) {
  return DILIGENCE_MOCKS.filter(a => a.attemptId === attemptId).slice(0, max);
}

export const MOCK_ATTEMPT_LIST: Attempt[] = [
  {
    id: 'IT-01-CT-006',
    status: 'Pendente',
    concludedVisitNumber: 2,
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e001',
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d004',
    createdAt: new Date('2023-01-04T13:10:00.000Z'),
    protocol: '123',
    updatedAt: new Date('2023-01-06T09:30:00.000Z'),
    diligences: getDiligencesFor('IT-01-CT-006'),
  },
  {
    id: 'IT-03-CT-018',
    status: 'Pendente',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e002',
    concludedVisitNumber: 2,
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d016',
    createdAt: new Date('2023-01-16T11:00:00.000Z'),
    protocol: '123',
    updatedAt: new Date('2023-01-18T08:50:00.000Z'),
    diligences: getDiligencesFor('IT-03-CT-018'),
  },
  {
    id: 'f47ac10b-58cc-0003-a567-0e02b2c3d003',
    status: 'Entregue',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e003',
    protocol: '123',
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d003',
    concludedVisitNumber: 2,
    createdAt: new Date('2023-01-01T09:00:00.000Z'),
    updatedAt: new Date('2023-01-05T11:00:00.000Z'),
    diligences: getDiligencesFor('f47ac10b-58cc-0003-a567-0e02b2c3d003'), // 2 diligences (d001, d003)
  },
  {
    id: 'IT-03-CT-004',
    status: 'Pendente',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e004',
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d002',
    concludedVisitNumber: 2,
    createdAt: new Date('2023-01-02T10:15:00.000Z'),
    protocol: '123',
    updatedAt: new Date('2023-01-04T16:45:00.000Z'),
    diligences: getDiligencesFor('IT-03-CT-004'),
  },
  {
    id: 'IT-01-CT-007',
    status: 'Cancelada',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e005',
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d005',
    concludedVisitNumber: 2,
    protocol: '123',
    createdAt: new Date('2023-01-05T07:50:00.000Z'),
    updatedAt: new Date('2023-01-07T15:20:00.000Z'),
    diligences: getDiligencesFor('IT-01-CT-007'),
  },
  {
    id: 'IT-02-CT-008',
    status: 'Cancelada',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e006',
    concludedVisitNumber: 2,
    protocol: '123',
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d006',
    createdAt: new Date('2023-01-06T12:00:00.000Z'),
    updatedAt: new Date('2023-01-08T17:10:00.000Z'),
    diligences: getDiligencesFor('IT-02-CT-008'),
  },
  {
    id: 'IT-03-CT-009',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e007',
    status: 'Pendente',
    concludedVisitNumber: 2,
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d007',
    createdAt: new Date('2023-01-07T09:40:00.000Z'),
    protocol: '123',
    updatedAt: new Date('2023-01-09T10:05:00.000Z'),
    diligences: getDiligencesFor('IT-03-CT-009'),
  },
  {
    id: 'IT-01-CT-010',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e008',
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d008',
    status: 'Entregue',
    concludedVisitNumber: 2,
    protocol: '123',
    createdAt: new Date('2023-01-08T11:25:00.000Z'),
    updatedAt: new Date('2023-01-10T13:50:00.000Z'),
    diligences: getDiligencesFor('IT-01-CT-010'),
  },
  {
    id: 'IT-02-CT-011',
    status: 'Pendente',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e009',
    concludedVisitNumber: 2,
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d009',
    createdAt: new Date('2023-01-09T08:15:00.000Z'),
    updatedAt: new Date('2023-01-11T16:00:00.000Z'),
    diligences: getDiligencesFor('IT-02-CT-011'),
    protocol: '123'
  },
  {
    id: 'IT-01-CT-012',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e010',
    status: 'Pendente',
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d010',
    createdAt: new Date('2023-01-10T10:30:00.000Z'),
    concludedVisitNumber: 2,
    updatedAt: new Date('2023-01-12T09:15:00.000Z'),
    diligences: getDiligencesFor('IT-01-CT-012'),
    protocol: '123'
  },
];
@Injectable({ providedIn: 'root' })
export class AttemptService {

  async getLastDiligences(page: number, pageSize: number): Promise<{ data: Diligence[], total: number, page: number, pageSize: number, hasNext: boolean, hasPrevious: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const total = DILIGENCE_MOCKS.length;

    // fatia o mock pra simular paginação de verdade
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = DILIGENCE_MOCKS.slice(start, end);

    return {
      data,
      total,
      page,
      pageSize,
      hasNext: page * pageSize < total,
      hasPrevious: page > 1
    };
  }
  async create(dto: CreateAttemptDTO) {
    console.log('Attempt created')
    console.log(JSON.stringify(dto, null, 2))
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d001' } };
  }
  async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: MOCK_ATTEMPT };
  }
  async getDiligencesByAttemptId(id: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: DILIGENCE_MOCKS.filter(att => att.attemptId == id) };
  }
  async getAllPaginated(page: number, pageSize: number): Promise<{ data: Attempt[], total: number, page: number, pageSize: number, hasNext: boolean, hasPrevious: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const total = MOCK_ATTEMPT_LIST.length;

    // fatia o mock pra simular paginação de verdade
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = MOCK_ATTEMPT_LIST.slice(start, end);

    return {
      data,
      total,
      page,
      pageSize,
      hasNext: page * pageSize < total,
      hasPrevious: page > 1
    };
  }
  async getConcludedPaginated(page: number, pageSize: number): Promise<{ data: Attempt[], total: number, page: number, pageSize: number, hasNext: boolean, hasPrevious: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const total = MOCK_ATTEMPT_LIST.length;

    // fatia o mock pra simular paginação de verdade
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = MOCK_ATTEMPT_LIST.slice(start, end);

    return {
      data,
      total,
      page,
      pageSize,
      hasNext: page * pageSize < total,
      hasPrevious: page > 1
    };
  }
  async cancelAttempt(id: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: {attemptId:id} }
  }
}