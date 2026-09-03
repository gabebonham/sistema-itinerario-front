import { inject, Injectable } from "@angular/core";
import { Diligence } from "../models/diligence";
import { CreateDiligenceDTO } from "../DTOS/create-attempt.dto";
import { UpdateDiligenceDTO } from "../DTOS/update-diligence.dto";
import { ApiResponse } from "../DTOS/api-response";
import { ApiService } from "./api";
import { PaginatedResponse } from "../DTOS/paginated-response";

@Injectable({ providedIn: 'root' })
export class DiligencesService {
  private api = inject(ApiService);
  async getDiligenceById(id: string): Promise<ApiResponse<Diligence>> {
    return await this.api.get<Diligence>('api/diligences/' + id)
  }
  async create(dto: CreateDiligenceDTO): Promise<ApiResponse<Diligence>> {
    return await this.api.post<Diligence>('api/diligences', dto)
  }
  async update(id: string, dto: UpdateDiligenceDTO): Promise<ApiResponse<null>> {
    console.log('Updating diligence with DTO:', dto);
    return await this.api.patch<null>('api/diligences/' + id, dto)
  }
  async getDiligencesByAttemptId(id: string): Promise<ApiResponse<Diligence[]>> {
    return await this.api.get<Diligence[]>('api/diligences/attempt/' + id)
  }
  async getProgressByNotificatorId(id: string): Promise<ApiResponse<PaginatedResponse<Diligence[]>>> {
    return await this.api.get<PaginatedResponse<Diligence[]>>('api/diligences/notificator/' + id + '/progress')
  }
  async patchDiligenceProgress(id: string, inProgress: boolean): Promise<ApiResponse<Diligence>> {
    return await this.api.patch<Diligence>('api/diligences/' + id + '/progress', { inProgress })
  }
}