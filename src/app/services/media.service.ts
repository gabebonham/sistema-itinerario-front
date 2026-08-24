import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MediaService {
    async uploadDiligenceAudio(diligenceId: string, file: File) {
        console.log('Audio uploaded')
        console.log(JSON.stringify(diligenceId, null, 2))
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, data: { url: '/audios/asdf' } };

    }
    async uploadDiligenceImages(diligenceId: string, files: File[]) {
        console.log('Images uploaded')
        console.log(JSON.stringify(diligenceId, null, 2))
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, data: { urls: ['/images/asdf','/images/aaaa'] } };
    }

}