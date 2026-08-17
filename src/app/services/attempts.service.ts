import { Injectable, signal } from '@angular/core';
import { Attempt } from '../models/attempt';
import { delay, of } from 'rxjs';
import { CreateAttemptDTO } from '../models/address';
const ATTEMPT_MOCKS = [
  // 1-67
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d004',
    clientName: 'Ricardo Santos',
    status: 'Pendente',
    window: 'Sábado',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-06'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 3,
    contractId: 'CT-006',
    createdAt: new Date('2023-01-04T13:10:00'),
    updatedAt: new Date('2023-01-06T09:30:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d016',
    clientName: 'Gustavo Lima',
    status: 'Pendente',
    window: 'Manhã',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-18'),
    visitNumber: 3,
    attempt: '3ª Tentativa',
    installmentsNumber: 6,
    contractId: 'CT-018',
    createdAt: new Date('2023-01-16T11:00:00'),
    updatedAt: new Date('2023-01-18T08:50:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d001',
    clientName: 'Ana Oliveira',
    status: 'Em Andamento',
    window: 'Sábado',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-03'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 5,
    contractId: 'CT-003',
    createdAt: new Date('2023-01-01T09:00:00'),
    updatedAt: new Date('2023-01-03T14:30:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d002',
    clientName: 'Carlos Souza',
    status: 'Concluído',
    window: 'Tarde',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-04'),
    visitNumber: 3,
    attempt: '3ª Tentativa',
    installmentsNumber: 1,
    contractId: 'CT-004',
    createdAt: new Date('2023-01-02T10:15:00'),
    updatedAt: new Date('2023-01-04T16:45:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d003',
    clientName: 'Mariana Costa',
    status: 'Cancelada',
    window: 'Manhã',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-05'),
    visitNumber: 2,
    attempt: '2ª Tentativa',
    installmentsNumber: 4,
    contractId: 'CT-005',
    createdAt: new Date('2023-01-03T08:20:00'),
    updatedAt: new Date('2023-01-05T11:00:00')
  },

  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d005',
    clientName: 'Fernanda Lima',
    status: 'Concluído',
    window: 'Manhã',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-07'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 2,
    contractId: 'CT-007',
    createdAt: new Date('2023-01-05T07:50:00'),
    updatedAt: new Date('2023-01-07T15:20:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d006',
    clientName: 'Bruno Alencar',
    status: 'Em Andamento',
    window: 'Tarde',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-08'),
    visitNumber: 2,
    attempt: '2ª Tentativa',
    installmentsNumber: 6,
    contractId: 'CT-008',
    createdAt: new Date('2023-01-06T12:00:00'),
    updatedAt: new Date('2023-01-08T17:10:00')
  },

  // 7-12
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d007',
    clientName: 'Juliana Vieira',
    status: 'Pendente',
    window: 'Manhã',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-09'),
    visitNumber: 3,
    attempt: '3ª Tentativa',
    installmentsNumber: 1,
    contractId: 'CT-009',
    createdAt: new Date('2023-01-07T09:40:00'),
    updatedAt: new Date('2023-01-09T10:05:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d008',
    clientName: 'Lucas Ferreira',
    status: 'Cancelada',
    window: 'Sábado',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-10'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 4,
    contractId: 'CT-010',
    createdAt: new Date('2023-01-08T11:25:00'),
    updatedAt: new Date('2023-01-10T13:50:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d009',
    clientName: 'Beatriz Rocha',
    status: 'Concluído',
    window: 'Tarde',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-11'),
    visitNumber: 2,
    attempt: '2ª Tentativa',
    installmentsNumber: 3,
    contractId: 'CT-011',
    createdAt: new Date('2023-01-09T08:15:00'),
    updatedAt: new Date('2023-01-11T16:00:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d010',
    clientName: 'Rodrigo Melo',
    status: 'Em Andamento',
    window: 'Manhã',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-12'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 2,
    contractId: 'CT-012',
    createdAt: new Date('2023-01-10T10:30:00'),
    updatedAt: new Date('2023-01-12T09:15:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d011',
    clientName: 'Camila Pires',
    status: 'Pendente',
    window: 'Tarde',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-13'),
    visitNumber: 2,
    attempt: '2ª Tentativa',
    installmentsNumber: 5,
    contractId: 'CT-013',
    createdAt: new Date('2023-01-11T14:00:00'),
    updatedAt: new Date('2023-01-13T15:45:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d012',
    clientName: 'Thiago Ribeiro',
    status: 'Concluído',
    window: 'Sábado',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-14'),
    visitNumber: 3,
    attempt: '3ª Tentativa',
    installmentsNumber: 1,
    contractId: 'CT-014',
    createdAt: new Date('2023-01-12T09:20:00'),
    updatedAt: new Date('2023-01-14T11:30:00')
  },

  // 13-18
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d013',
    clientName: 'Amanda Martins',
    status: 'Cancelada',
    window: 'Manhã',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-15'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 3,
    contractId: 'CT-015',
    createdAt: new Date('2023-01-13T08:00:00'),
    updatedAt: new Date('2023-01-15T10:20:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d014',
    clientName: 'Felipe Cardoso',
    status: 'Em Andamento',
    window: 'Sábado',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-16'),
    visitNumber: 2,
    attempt: '2ª Tentativa',
    installmentsNumber: 4,
    contractId: 'CT-016',
    createdAt: new Date('2023-01-14T13:40:00'),
    updatedAt: new Date('2023-01-16T14:00:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d015',
    clientName: 'Larissa Nunes',
    status: 'Concluído',
    window: 'Tarde',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-17'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 2,
    contractId: 'CT-017',
    createdAt: new Date('2023-01-15T09:10:00'),
    updatedAt: new Date('2023-01-17T17:00:00')
  },

  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d017',
    clientName: 'Patricia Mendes',
    status: 'Cancelada',
    window: 'Tarde',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-19'),
    visitNumber: 2,
    attempt: '2ª Tentativa',
    installmentsNumber: 1,
    contractId: 'CT-019',
    createdAt: new Date('2023-01-17T15:30:00'),
    updatedAt: new Date('2023-01-19T16:10:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d018',
    clientName: 'Leonardo Cruz',
    status: 'Em Andamento',
    window: 'Sábado',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-20'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 5,
    contractId: 'CT-020',
    createdAt: new Date('2023-01-18T10:00:00'),
    updatedAt: new Date('2023-01-20T09:40:00')
  },

  // 19-24
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d019',
    clientName: 'Isabela Fontes',
    status: 'Concluído',
    window: 'Manhã',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-21'),
    visitNumber: 2,
    attempt: '2ª Tentativa',
    installmentsNumber: 3,
    contractId: 'CT-021',
    createdAt: new Date('2023-01-19T08:25:00'),
    updatedAt: new Date('2023-01-21T12:00:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d020',
    clientName: 'Daniel Barbosa',
    status: 'Pendente',
    window: 'Tarde',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-22'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 2,
    contractId: 'CT-022',
    createdAt: new Date('2023-01-20T14:15:00'),
    updatedAt: new Date('2023-01-22T15:30:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d021',
    clientName: 'Vanessa Dias',
    status: 'Concluído',
    window: 'Sábado',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-23'),
    visitNumber: 3,
    attempt: '3ª Tentativa',
    installmentsNumber: 4,
    contractId: 'CT-023',
    createdAt: new Date('2023-01-21T09:50:00'),
    updatedAt: new Date('2023-01-23T11:20:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d022',
    clientName: 'Renan Moreira',
    status: 'Cancelada',
    window: 'Manhã',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-24'),
    visitNumber: 1,
    attempt: '1ª Tentativa',
    installmentsNumber: 1,
    contractId: 'CT-024',
    createdAt: new Date('2023-01-22T07:40:00'),
    updatedAt: new Date('2023-01-24T08:10:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d023',
    clientName: 'Gabriela Ramos',
    status: 'Em Andamento',
    window: 'Tarde',
    agent: 'Marcelão Big Boy',
    date: new Date('2023-01-25'),
    visitNumber: 2,
    attempt: '2ª Tentativa',
    installmentsNumber: 3,
    contractId: 'CT-025',
    createdAt: new Date('2023-01-23T13:00:00'),
    updatedAt: new Date('2023-01-25T14:45:00')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d024',
    clientName: 'Eduardo Antunes',
    status: 'Pendente',
    window: 'Sábado',
    agent: 'Gabriel Grote',
    date: new Date('2023-01-26'),
    visitNumber: 3,
    attempt: '3ª Tentativa',
    installmentsNumber: 2,
    contractId: 'CT-026',
    createdAt: new Date('2023-01-24T10:10:00'),
    updatedAt: new Date('2023-01-26T16:30:00')
  }
];


@Injectable({ providedIn: 'root' })
export class AttemptsService {
  async getAttemptById(id: string): Promise<Attempt | undefined> {
    // Simula uma busca no banco de dados
    return ATTEMPT_MOCKS.find(attempt => attempt.id === id);
  }
  async getAttempts(page: number, pageSize: number): Promise<{ data: Attempt[], total: number, page: number, pageSize: number, hasNext: boolean, hasPrevious: boolean }> {
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
  async create(dto:CreateAttemptDTO) {
    console.log('Attempt created')
    console.log(JSON.stringify(dto, null, 2))
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data:{id:'f47ac10b-58cc-4372-a567-0e02b2c3d001'} };
  }
}