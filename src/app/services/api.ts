import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { environment } from '../../environtments/environment.dev';
import { ApiResponse } from '../DTOS/api-response';

enum ContentType {
    JSON = 'application/json',
    FORM_DATA = 'multipart/form-data'
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private api: AxiosInstance;
    private contentType: ContentType;

    constructor(contentType: ContentType) {
        this.contentType = contentType
        this.api = axios.create({
            baseURL: environment.backendUrl,
            headers: {
                'Content-Type': contentType
            }
        });
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });
    }
    async uploadFile<T>(
        url: string,
        data: {
            file?: File;
            files?: File[];
        },
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {

        if (this.contentType === ContentType.JSON) {
            throw new Error(
                'Upload de arquivo requer ContentType.FORM_DATA'
            );
        }

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
            config
        );

        return response.data;
    }

    async get<T>(url: string, config?: AxiosRequestConfig) {
        if (this.contentType == ContentType.FORM_DATA) throw new Error('Consumo de endpoints JSON requer ContentType.JSON');
        const response = await this.api.get<ApiResponse<T>>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        if (this.contentType == ContentType.FORM_DATA) throw new Error('Consumo de endpoints JSON requer ContentType.JSON');
        const response = await this.api.post<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        if (this.contentType == ContentType.FORM_DATA) throw new Error('Consumo de endpoints JSON requer ContentType.JSON');
        const response = await this.api.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig) {
        if (this.contentType == ContentType.FORM_DATA) throw new Error('Consumo de endpoints JSON requer ContentType.JSON');
        const response = await this.api.delete<ApiResponse<T>>(url, config);
        return response.data;
    }
}