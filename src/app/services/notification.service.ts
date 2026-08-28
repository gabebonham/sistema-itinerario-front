import { ApiResponse } from "../DTOS/api-response";
import { CreateNotificationDto } from "../DTOS/create-notification.dto";
import { PaginatedResponse } from "../DTOS/paginated-response";
import { Notification } from "../models/notification";
import { ApiService } from "./api";
import { MOCK_ATTEMPT_LIST } from "./attempt.service";
import { DILIGENCE_MOCKS } from "./diligences.service";
import { inject, Injectable } from "@angular/core";

const NOTIFICATOR_1 = 'f47ac10b-58cc-4372-a567-0e02b2c3n001'; // Gabriel Grote
const NOTIFICATOR_2 = 'f47ac10b-58cc-4372-a567-0e02b2c3n002'; // Marcelo Lopes

function buildNotification(
  id: string,
  notificatorId: string,
  attemptId: string,
  diligenceId: string,
  debtorId: string,
  createdAt: Date,
  updatedAt: Date,
): Notification {
  const diligence = DILIGENCE_MOCKS.find(d => d.id === diligenceId);
  const attempt = MOCK_ATTEMPT_LIST.find(a => a.id === attemptId);
  return new Notification(id, notificatorId, attemptId, diligenceId, debtorId, createdAt, updatedAt, diligence, attempt);
}

export const NOTIFICATION_MOCKS: Notification[] = [
  // Gabriel Grote — 5 notificações
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f001',
    NOTIFICATOR_1,
    'IT-03-CT-004',
    'f47ac10b-58cc-4372-a567-0e02b2c3d002',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-02T10:20:00.000Z'),
    new Date('2023-01-04T16:50:00.000Z'),
  ),
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f002',
    NOTIFICATOR_1,
    'IT-01-CT-006',
    'f47ac10b-58cc-4372-a567-0e02b2c3d004',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-04T13:15:00.000Z'),
    new Date('2023-01-06T09:35:00.000Z'),
  ),
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f003',
    NOTIFICATOR_1,
    'IT-02-CT-008',
    'f47ac10b-58cc-4372-a567-0e02b2c3d006',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-06T12:05:00.000Z'),
    new Date('2023-01-08T17:15:00.000Z'),
  ),
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f004',
    NOTIFICATOR_1,
    'IT-01-CT-010',
    'f47ac10b-58cc-4372-a567-0e02b2c3d008',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-08T11:30:00.000Z'),
    new Date('2023-01-10T13:55:00.000Z'),
  ),
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f005',
    NOTIFICATOR_1,
    'IT-01-CT-012',
    'f47ac10b-58cc-4372-a567-0e02b2c3d010',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-10T10:35:00.000Z'),
    new Date('2023-01-12T09:20:00.000Z'),
  ),

  // Marcelo Lopes — 5 notificações
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f006',
    NOTIFICATOR_2,
    'f47ac10b-58cc-0003-a567-0e02b2c3d003',
    'f47ac10b-58cc-4372-a567-0e02b2c3d001',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-01T09:05:00.000Z'),
    new Date('2023-01-03T14:35:00.000Z'),
  ),
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f007',
    NOTIFICATOR_2,
    'f47ac10b-58cc-0003-a567-0e02b2c3d003',
    'f47ac10b-58cc-4372-a567-0e02b2c3d003',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-03T08:25:00.000Z'),
    new Date('2023-01-05T11:05:00.000Z'),
  ),
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f008',
    NOTIFICATOR_2,
    'IT-01-CT-007',
    'f47ac10b-58cc-4372-a567-0e02b2c3d005',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-05T07:55:00.000Z'),
    new Date('2023-01-07T15:25:00.000Z'),
  ),
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f009',
    NOTIFICATOR_2,
    'IT-03-CT-009',
    'f47ac10b-58cc-4372-a567-0e02b2c3d007',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-07T09:45:00.000Z'),
    new Date('2023-01-09T10:10:00.000Z'),
  ),
  buildNotification(
    'f47ac10b-58cc-4372-a567-0e02b2c3f010',
    NOTIFICATOR_2,
    'IT-02-CT-011',
    'f47ac10b-58cc-4372-a567-0e02b2c3d009',
    'a1b2c3d4-58cc-4372-a567-0e02b2c3e001',
    new Date('2023-01-09T08:20:00.000Z'),
    new Date('2023-01-11T16:05:00.000Z'),
  ),
];
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);
  async getAllByNotificatorId(id: string): Promise<ApiResponse<PaginatedResponse<Notification[]>>> {
    return await this.api.get<PaginatedResponse<Notification[]>>('api/notifications/notificator/' + id)
  }
  async getById(id: string): Promise<ApiResponse<Notification>> {
    return await this.api.get<Notification>('api/notifications/' + id)
  }
  async delete(id: string): Promise<ApiResponse<null>> {
    return await this.api.delete<null>('api/notifications/' + id)
  }
  async create(dto: CreateNotificationDto): Promise<ApiResponse<Notification>> {
    return await this.api.post<Notification>('api/notifications', dto)
  }
}