import { ApiResponse } from "../DTOS/api-response";
import { RouteData, RouteRequest } from "../DTOS/route.dto";
import { ApiService } from "./api";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class RouteService {
    private api = inject(ApiService);
    async calculateRoute(
        request: RouteRequest
    ): Promise<ApiResponse<RouteData>> {

        const response = await this.api.post<RouteData>(
            '/api/routes/calculate',
            request
        );

        return response;
    }
}