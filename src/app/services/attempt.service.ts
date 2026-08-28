import { inject, Injectable } from "@angular/core";
import { Diligence } from "../models/diligence";
import { DILIGENCE_MOCKS } from "./diligences.service";
import { Attempt } from "../models/attempt";
import { CreateAttemptDTO } from "../DTOS/create-itinerary.dto";
import { DEBTOR_MOCK } from "./debtor.service";
import { ApiService } from "./api";
import { ApiResponse } from "../DTOS/api-response";
import { PaginatedResponse } from "../DTOS/paginated-response";
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
    debtor:DEBTOR_MOCK
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
    debtor:DEBTOR_MOCK,
  },
  {
    id: 'f47ac10b-58cc-0003-a567-0e02b2c3d003',
    status: 'Entregue',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e003',
    protocol: '123',
    lastDiligenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d003',
    debtor:DEBTOR_MOCK,
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
    debtor:DEBTOR_MOCK,
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
    debtor:DEBTOR_MOCK,
    createdAt: new Date('2023-01-05T07:50:00.000Z'),
    updatedAt: new Date('2023-01-07T15:20:00.000Z'),
    diligences: getDiligencesFor('IT-01-CT-007'),
  },
  {
    id: 'IT-02-CT-008',
    status: 'Cancelada',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e006',
    concludedVisitNumber: 2,
    debtor:DEBTOR_MOCK,
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
    debtor:DEBTOR_MOCK,
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
    debtor:DEBTOR_MOCK,
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
    debtor:DEBTOR_MOCK,
    updatedAt: new Date('2023-01-11T16:00:00.000Z'),
    diligences: getDiligencesFor('IT-02-CT-011'),
    protocol: '123'
  },
  {
    id: 'IT-01-CT-012',
    debtorId: 'b2e1a10b-58cc-4372-a567-0e02b2c3e010',
    status: 'Pendente',
    debtor:DEBTOR_MOCK,
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

  private readonly api = inject(ApiService);


  async create(dto: CreateAttemptDTO):Promise<ApiResponse<Attempt>> {
    return await this.api.post<Attempt>('api/attempts', dto)
  }
  async getById(id: string): Promise<ApiResponse<Attempt>> {
    return await this.api.get<Attempt>('api/attempts/'+ id)
  }

  async getAllPaginated(page: number, pageSize: number): Promise<ApiResponse<PaginatedResponse<Attempt[]>>> {
    const params: any = {
      page, pageSize
    }
    return await this.api.get<PaginatedResponse<Attempt[]>>('api/attempts', { params })
  }
  async getConcludedPaginated(page: number, pageSize: number): Promise<ApiResponse<PaginatedResponse<Attempt[]>>> {
    const params: any = {
      page, 
      pageSize,
      status: ['Entregue','Cancelada']
    }
    return await this.api.get<PaginatedResponse<Attempt[]>>('api/attempts', { params })
  }
  
  async cancelAttempt(id: string):Promise<ApiResponse<null>> {
    return await this.api.patch<null>('api/attempts/'+id+'/cancel')
  }
  
}