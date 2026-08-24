import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {

  private mediaRecorder?: MediaRecorder;
  private audioChunks: Blob[] = [];
  private stream?: MediaStream;

  async startRecording(): Promise<void> {

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    this.audioChunks = [];

    this.mediaRecorder = new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  stopRecording(): Promise<Blob> {

    return new Promise((resolve, reject) => {

      if (!this.mediaRecorder) {
        reject(new Error('Nenhuma gravação ativa.'));
        return;
      }

      this.mediaRecorder.onstop = () => {

        const blob = new Blob(this.audioChunks, {
          type: this.mediaRecorder?.mimeType || 'audio/webm'
        });

        this.stream?.getTracks().forEach(track => track.stop());

        this.mediaRecorder = undefined;
        this.stream = undefined;
        this.audioChunks = [];

        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }
}