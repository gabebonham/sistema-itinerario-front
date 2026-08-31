import { inject, Injectable } from "@angular/core";
import { Attempt } from "../models/attempt";
import { CreateAttemptDTO } from "../DTOS/create-itinerary.dto";
import { ApiService } from "./api";
import { ApiResponse } from "../DTOS/api-response";
import { PaginatedResponse } from "../DTOS/paginated-response";
import { AttemptsFilter } from "./attempts-filter.service";

@Injectable({ providedIn: 'root' })
export class AttemptService {

  private readonly api = inject(ApiService);

  async create(dto: CreateAttemptDTO): Promise<ApiResponse<Attempt>> {
    return await this.api.post<Attempt>('api/attempts', dto)
  }
  async getById(id: string): Promise<ApiResponse<Attempt>> {
    return await this.api.get<Attempt>('api/attempts/' + id)
  }
  async getAllPaginated(page: number = 1, pageSize: number = 8, filter?: AttemptsFilter): Promise<ApiResponse<PaginatedResponse<Attempt[]>>> {
    const params: any = {
      page,
      pageSize,
      filter
    }
    return await this.api.get<PaginatedResponse<Attempt[]>>('api/attempts', { params })
  }
  async getConcludedPaginated(
    page: number,
    pageSize: number
  ): Promise<ApiResponse<PaginatedResponse<Attempt[]>>> {

    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    params.append('statuses', 'Delivered');
    params.append('statuses', 'Cancelled');

    return await this.api.get<PaginatedResponse<Attempt[]>>(
      'api/attempts',
      { params }
    );
  }
  async cancelAttempt(id: string): Promise<ApiResponse<null>> {
    return await this.api.patch<null>('api/attempts/' + id + '/cancel')
  }
  async getPendingPaginated(page: number, pageSize: number): Promise<ApiResponse<PaginatedResponse<Attempt[]>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    params.append('statuses', 'Pending');
    return await this.api.get<PaginatedResponse<Attempt[]>>('api/attempts', { params })
  }
}