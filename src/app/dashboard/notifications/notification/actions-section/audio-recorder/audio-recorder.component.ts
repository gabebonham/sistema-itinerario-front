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
    constructor(
        private recorder: AudioRecorderService
    ) { }

    async startRecording() {

        this.isRecording.set(true);

        try {

            await this.recorder.startRecording();

        } catch (error) {

            console.error('Erro ao iniciar gravação:', error);

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

            this.saveAudio.emit(this.audioFile)
        } catch (error) {

            console.error('Erro ao parar gravação:', error);

        } finally {

            this.isRecording.set(false);

        }
    }

    deleteAudio() {

        if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
            this.audioUrl = undefined;
        }
    }

    ngOnDestroy() {

        if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
        }
    }
}