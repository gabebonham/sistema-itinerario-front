import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api';
import { ApiResponse } from '../DTOS/api-response';

@Injectable({ providedIn: 'root' })
export class MediaService {
    private api = inject(ApiService);
    async uploadAudio(file: File) {
        return await this.api.uploadFile<{ urls?: string[], paths?: string[] }>('api/storage/audio', { file })
    }
    async uploadImages(files: File[]) {
        return await this.api.uploadFile<{ urls?: string[], paths?: string[] }>('api/storage/images', { files })
    }
    async getAudioByDiligenceId(id: string): Promise<ApiResponse<{ urls?: string[], paths?: string[] }>> {
        return await this.api.get<{ urls?: string[], paths?: string[] }>('api/storage/audio/diligeces/' + id + '/url')
    }
    async getImagesByDiligenceId(id: string): Promise<ApiResponse<{ urls?: string[], paths?: string[] }>> {
        return await this.api.get<{ urls?: string[], paths?: string[] }>('api/storage/images/diligeces/' + id + '/urls')
    }
}