import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { environment } from '../../environtments/environment.dev';
import { ApiResponse } from '../DTOS/api-response';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: environment.backendUrl,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.api.interceptors.response.use(
            response => response,

            (error: any) => {
                if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
                    const data = error.response?.data;

                    if (
                        data &&
                        typeof data === 'object' &&
                        'success' in data &&
                        'statusCode' in data
                    ) {
                        return Promise.resolve(error.response);
                    }
                }

                return Promise.reject(error);
            }
        );
    }
    async uploadFile<T>(
        url: string,
        data: {
            file?: File;
            files?: File[];
        },
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {

        if (
            (!data.file && !data.files) ||
            (data.file && data.files)
        ) {
            throw new Error(
                'Informe um arquivo ou uma lista de arquivos, mas não ambos.'
            );
        }

        if (data.files && data.files.length === 0) {
            throw new Error(
                'A lista de arquivos não pode estar vazia.'
            );
        }

        const formData = new FormData();

        if (data.file) {
            formData.append('file', data.file);
        }

        if (data.files) {
            for (const file of data.files) {
                formData.append('files', file);
            }
        }

        const response = await this.api.post<ApiResponse<T>>(
            url,
            formData,
            {
                ...config,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    }

    async get<T>(url: string, config?: AxiosRequestConfig) {
        const response = await this.api.get<ApiResponse<T>>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        const response = await this.api.post<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        const response = await this.api.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig) {
        const response = await this.api.delete<ApiResponse<T>>(url, config);
        return response.data;
    }
}