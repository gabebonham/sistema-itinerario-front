import { Component, OnDestroy, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AudioRecorderService } from '../../../../../services/audio-recorder.service';

@Component({
    selector: 'app-audio-recorder',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './audio-recorder.component.html'
})
export class AudioRecorderComponent implements OnDestroy {

    isRecording = signal(false);
    audioUrl?: string;
    audioFile?: File;
    saveAudio = output<File | undefined>()
    errorMessage = signal<string | undefined>(undefined);

    constructor(
        private recorder: AudioRecorderService
    ) { }

    async startRecording() {
        this.errorMessage.set(undefined);

        try {
            console.log('Iniciando gravação...');
            console.log('Secure context:', window.isSecureContext);
            console.log('MediaDevices:', navigator.mediaDevices);

            await this.recorder.startRecording();

            this.isRecording.set(true);

            console.log('Gravação iniciada com sucesso');
        } catch (error) {
            console.error('Erro ao iniciar gravação:', error);

            this.errorMessage.set(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível acessar o microfone.'
            );

            this.isRecording.set(false);
        }
    }

    async stopRecording() {
        try {
            const blob = await this.recorder.stopRecording();

            this.audioUrl = URL.createObjectURL(blob);

            this.audioFile = new File(
                [blob],
                `audio-${Date.now()}.webm`,
                {
                    type: blob.type || 'audio/webm'
                }
            );

            this.saveAudio.emit(this.audioFile);
        } catch (error) {
            console.error('Erro ao parar gravação:', error);
        } finally {
            this.isRecording.set(false);
        }
    }
    async finishRecording(): Promise<void> {
        if (!this.isRecording()) {
            return;
        }

        await this.stopRecording();
    }
    deleteAudio() {
        if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
            this.audioUrl = undefined;
        }

        this.audioFile = undefined;
        this.saveAudio.emit(undefined);
    }

    ngOnDestroy() {
        if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
        }
    }

}