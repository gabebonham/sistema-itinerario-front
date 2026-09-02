import { inject, Injectable } from "@angular/core";
import { Attempt, AttemptStatus, DisplayAttemptStatus } from "../models/attempt";
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
  async updateStatus(id: string, status: AttemptStatus): Promise<ApiResponse<Attempt>> {
    return await this.api.patch<Attempt>('api/attempts/' + id, { status })
  }
  async getById(id: string): Promise<ApiResponse<Attempt>> {
    return await this.api.get<Attempt>('api/attempts/' + id)
  }
  async getWithLastDiligencesPaginated(
    page: number = 1,
    pageSize: number = 5,
    filter?: AttemptsFilter
  ): Promise<ApiResponse<PaginatedResponse<Attempt[]>>> {

    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filter?.protocol) {
      params.append('protocol', filter.protocol);
    }

    if (filter?.debtorName) {
      params.append('debtorName', filter.debtorName);
    }

    if (filter?.window) {
      params.append('window', filter.window);
    }

    if (filter?.diligenceOrdinal) {
      params.append('diligenceOrdinal', filter.diligenceOrdinal);
    }

    if (filter?.statuses) {
      filter.statuses.forEach(status => params.append('statuses', this.getEnumValue(status)));
    }

    if (filter?.from) {
      params.append('from', filter.from);
    }

    if (filter?.to) {
      params.append('to', filter.to);
    }
    params.append('diligenceVisited', filter?.diligenceVisited.toString() ?? 'true');

    console.log('params', params.toString())
    return await this.api.get<PaginatedResponse<Attempt[]>>(
      'api/attempts/with-last-diligences',
      { params }
    );
  }
  async getAllPaginated(
    page: number = 1,
    pageSize: number = 8,
    filter?: AttemptsFilter
  ): Promise<ApiResponse<PaginatedResponse<Attempt[]>>> {

    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filter?.protocol) {
      params.append('protocol', filter.protocol);
    }

    if (filter?.debtorName) {
      params.append('debtorName', filter.debtorName);
    }

    if (filter?.window) {
      params.append('window', filter.window);
    }

    if (filter?.diligenceOrdinal) {
      params.append('diligenceOrdinal', filter.diligenceOrdinal);
    }

    if (filter?.statuses) {
      filter.statuses.forEach(status => params.append('statuses', this.getEnumValue(status)));
    }

    if (filter?.from) {
      params.append('from', filter.from);
    }

    if (filter?.to) {
      params.append('to', filter.to);
    }

    return await this.api.get<PaginatedResponse<Attempt[]>>(
      'api/attempts',
      { params }
    );
  }
  private getEnumValue(status: DisplayAttemptStatus): string {
    switch (status) {
      case 'Pendente':
        return 'Pending';
      case 'Entregue':
        return 'Delivered';
      case 'Cancelada':
        return 'Cancelled';
      case 'Finalizada':
        return 'Finished';
      default:
        return status;
    }
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
    params.append('statuses', 'Finished');

    return await this.api.get<PaginatedResponse<Attempt[]>>(
      'api/attempts',
      { params }
    );
  }
  async cancelAttempt(id: string): Promise<ApiResponse<null>> {
    return await this.api.patch<null>('api/attempts/' + id + '/cancel')
  }
  async deliverAttempt(id: string): Promise<ApiResponse<null>> {
    return await this.api.patch<null>('api/attempts/' + id + '/deliver')
  }
  async getPendingPaginated(page: number, pageSize: number): Promise<ApiResponse<PaginatedResponse<Attempt[]>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    params.append('statuses', 'Pending');
    return await this.api.get<PaginatedResponse<Attempt[]>>('api/attempts', { params })
  }
}