import { inject, Injectable } from "@angular/core";
import { Diligence } from "../models/diligence";
import { CreateDiligenceDTO } from "../DTOS/create-attempt.dto";
import { UpdateDiligenceDTO } from "../DTOS/update-diligence.dto";
import { ApiResponse } from "../DTOS/api-response";
import { ApiService } from "./api";
import { PatchDiligenceDto } from "../DTOS/patch-diligence-progress.dto";

@Injectable({ providedIn: 'root' })
export class DiligencesService {
  private api = inject(ApiService);
  async getDiligenceById(id: string): Promise<ApiResponse<Diligence>> {
    return await this.api.get<Diligence>('api/diligences/' + id)
  }
  async create(dto: CreateDiligenceDTO): Promise<ApiResponse<Diligence>> {
    console.log('dto')
    console.log(dto)
    return await this.api.post<Diligence>('api/diligences', dto)
  }
  async update(id: string, dto: UpdateDiligenceDTO): Promise<ApiResponse<null>> {
    console.log('Updating diligence with DTO:', dto);
    return await this.api.patch<null>('api/diligences/' + id, dto)
  }
  async getDiligencesByAttemptId(id: string): Promise<ApiResponse<Diligence[]>> {
    return await this.api.get<Diligence[]>('api/diligences/attempt/' + id)
  }
  async getProgressByNotificatorId(id: string): Promise<ApiResponse<{ongoingDiligences:Diligence[], doneDiligencesCount:number}>> {
    return await this.api.get<{ongoingDiligences:Diligence[], doneDiligencesCount:number}>('api/diligences/notificator/' + id + '/progress')
  }
  async patchDiligenceProgress(dto:PatchDiligenceDto): Promise<ApiResponse<Diligence>> {
    const request = {
      inProgress: dto.inProgress,
      notificatorId: dto.notificatorId,
      notificatorName: dto.notificatorName,
      start: dto.start,
      finished: dto.finish,
    }
    return await this.api.patch<Diligence>('api/diligences/' + dto.id + '/progress', request)
  }
}