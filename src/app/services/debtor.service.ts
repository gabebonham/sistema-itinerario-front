import { Injectable, signal } from '@angular/core';
import { Debtor } from '../models/debtor';

const DEBTOR_MOCK: Debtor =
  new Debtor(
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    'Marcelo Lopes',
    '61857917452',
    '8514726',
    'f47ac10b-58cc-4372-a567-0e02b2c3d001',
    new Date('2023-01-01T09:10:00'),
    new Date('2023-01-03T14:35:00')
  );

@Injectable({ providedIn: 'root' })
export class DebtorService {
  async getDebtorByDiligenceId(id: string): Promise<Debtor> {
    return DEBTOR_MOCK;
  }
}