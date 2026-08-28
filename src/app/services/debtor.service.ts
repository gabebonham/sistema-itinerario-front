import { inject, Injectable, signal } from '@angular/core';
import { Debtor } from '../models/debtor';
import { CreateDebtorDTO } from '../DTOS/create-debtor.dto';
import { ApiService } from './api';
import { ApiResponse } from '../DTOS/api-response';

export const DEBTOR_MOCK: Debtor =
  new Debtor(
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    'Marcelo Lopes',
    '61857917452',
    'Rua José de Alencar, 331, Teresópolis',
    '8795683215',
    new Date('2023-01-01T09:10:00'),
    new Date('2023-01-03T14:35:00')
  );

@Injectable({ providedIn: 'root' })
export class DebtorService {
  private api = inject(ApiService);

  async getById(id: string):Promise<ApiResponse<Debtor>> {
    return await this.api.get<Debtor>('api/debtors/'+id)
  }
  async create(dto: CreateDebtorDTO):Promise<ApiResponse<Debtor>> {
    return await this.api.post<Debtor>('api/debtors', dto)
  }
}