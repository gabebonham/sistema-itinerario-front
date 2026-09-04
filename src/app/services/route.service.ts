import { ApiResponse } from "../DTOS/api-response";
import { RouteData, RouteRequest } from "../DTOS/route.dto";
import { Notification } from "../models/notification";
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
    async prepareRoute(id:string, dto:any): Promise<ApiResponse<{notifications:Notification[],route:RouteData}>> {
        console.log('dto')
        console.log(dto)
        const response = await this.api.post<{notifications:Notification[],route:RouteData}>(
            '/api/routes/notificator/'+id+'/prepare-route',
            dto
        );
        return response;
    }
}