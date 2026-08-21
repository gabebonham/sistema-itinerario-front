import { Injectable, signal } from '@angular/core';
import { Debtor } from '../models/debtor';
import { CreateDebtorDTO } from '../DTOS/create-debtor.dto';

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
  async getDebtorByDiligenceId(id: string): Promise<Debtor> {
    return DEBTOR_MOCK;
  }
  async getById(id: string) {
    return {success:true,data:DEBTOR_MOCK};
  }
  async create(dto: CreateDebtorDTO) {
    console.log('Debtor created')
    console.log(JSON.stringify(dto, null, 2))
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d001' } };
  }
}