import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api';

@Injectable({ providedIn: 'root' })
export class MediaService {
    private api = inject(ApiService);
    async uploadAudio(file: File) {
        return await this.api.uploadFile<{ urls?: string[], paths?: string[] }>('api/storage/audio', { file })
    }
    async uploadImages(files: File[]) {
        return await this.api.uploadFile<{ urls?: string[], paths?: string[] }>('api/storage/images', { files })
    }
    async getAudio(file: File) {
        return await this.api.uploadFile<{ urls?: string[], paths?: string[] }>('api/storage/image/63545e7b-d9bc-4847-8311-87fa741f60d5/url', { file })
    }
}