import { ApiResponse } from "../DTOS/api-response";
import { CreateNotificationDto } from "../DTOS/create-notification.dto";
import { PaginatedResponse } from "../DTOS/paginated-response";
import { Notification } from "../models/notification";
import { ApiService } from "./api";
import { inject, Injectable } from "@angular/core";

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