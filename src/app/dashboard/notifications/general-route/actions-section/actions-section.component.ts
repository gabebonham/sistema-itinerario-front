import { Component, inject, input, output, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Debtor } from '../../../../models/debtor';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgClass } from '@angular/common';
import { UpdateDiligenceDTO } from '../../../../DTOS/update-diligence.dto';
import { DiligencesService } from '../../../../services/diligences.service';
import { Diligence } from '../../../../models/diligence';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AudioRecorderComponent } from './audio-recorder/audio-recorder.component';
import { MediaService } from '../../../../services/media.service';
import { NotificationService } from '../../../../services/notification.service';
import { AttemptService } from '../../../../services/attempt.service';

@Component({
    selector: 'app-actions-section',
    imports: [CommonModule, AudioRecorderComponent, MatSnackBarModule, MatIconModule, NgClass, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './actions-section.component.html',
})
export class ActionsSectionComponent {
    private snackBar = inject(MatSnackBar);
    debtor = input<Debtor>();
    diligence = input.required<Diligence | undefined>()
    notificationId = input.required<string | undefined>()
    diligenceService = inject(DiligencesService)
    notificationService = inject(NotificationService)
    attemptService = inject(AttemptService)
    @ViewChild(AudioRecorderComponent)
    audioRecorder?: AudioRecorderComponent;
    mediaService = inject(MediaService)
    debtorFound = signal<boolean | undefined>(undefined)
    private fb = inject(FormBuilder);
    isLoading = signal(false)
    nextDiligence = output()
    constructor(private router: Router) { }
    form = this.fb.group({
        factsObservations: [''],
        generalObservations: [''],
        propertyObservations: [''],
    });
    onFound(value: boolean) {
        if (this.debtorFound() == value) {
            this.debtorFound.set(undefined)
        } else {
            this.debtorFound.set(value)
        }
    }
    previewUrl: string | null = null;
    selectedFile: File | null = null;
    audioFile?: File;

    photos = signal<{ file: File; preview: string }[]>([]);

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            this.photos.update(list => [...list, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file);

        input.value = '';
    }

    removePhoto(index: number): void {
        this.photos.update(list => list.filter((_, i) => i !== index));
    }

    async finish() {
        if (this.notificationId() === undefined) {
            this.showToast('Notificação inválida.');
            return;
        }
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.debtorFound() === undefined) {
            this.showToast('Selecione se o devedor foi encontrado.');
            return;
        }

        const diligenceId = this.diligence()?.id;
        if (!diligenceId) {
            this.showToast('Diligência inválida.');
            return;
        }
        await this.audioRecorder?.finishRecording();

        this.isLoading.set(true);

        const audioResult = await this.sendAudio()
        const imagesResult = await this.sendImages()
        if (!audioResult.success) {
            this.showToast("Erro ao salvar audio.")
            return
        }
        if (!imagesResult.success) {
            this.showToast("Erro ao salvar imagens.")
            return
        }
        const audioUrls = audioResult.data.paths
        const imageUrls = imagesResult.data.paths

        const concludeVisitDto: UpdateDiligenceDTO = {
            factsObservations: this.form.value.factsObservations ?
                this.form.value.factsObservations.split(';') : undefined,
            generalObservations: this.form.value.generalObservations ?
                this.form.value.generalObservations.split(';') : undefined,
            propertyObservations: this.form.value.propertyObservations ?
                this.form.value.propertyObservations.split(';') : undefined,
            wasDebtorFound: this.debtorFound()!,
            audioUrls,
            imageUrls,
            attemptId: this.diligence()?.attemptId,
            visited: true
        };
        this.diligenceService.update(diligenceId, concludeVisitDto)
            .then(result => {
                if (result.success) {
                    this.notificationService.delete(this.notificationId()!)
                        .then(deleteResult => {
                            if (deleteResult.success) {

                                if (this.debtorFound()!) {
                                    this.attemptService
                                        .deliverAttempt(this.diligence()?.attemptId!)
                                        .then(updateResult => {

                                            if (!updateResult.success) {
                                                console.log(updateResult.error);
                                                this.showToast(updateResult.error);
                                                return;
                                            }
                                            this.finishSuccess();
                                        });

                                } else {
                                    this.finishSuccess();
                                }
                            }
                        });
                } else {
                    console.log(result.error)
                    this.showToast(result.error);
                }
            })
            .finally(() => {
                this.isLoading.set(false);
            });
    }
    onSaveAudio(audioFile?: File) {
        this.audioFile = audioFile
    }
    updateDiligenceProgress(id: string) {
        this.diligenceService.patchDiligenceProgress({id, inProgress:false, finish:new Date()}).then(result => {
            if (!result.success) {
                this.showToast("Erro ao atualizar progresso da diligência.");
            }
        });
    }
    private finishSuccess() {
        this.updateDiligenceProgress(this.diligence()?.id!)
        this.showToast('Visita concluída com sucesso!');
        this.resetInputs();
        this.nextDiligence.emit();
    }
    resetInputs() {
        this.form.reset({
            factsObservations: '',
            generalObservations: '',
            propertyObservations: ''
        });

        this.debtorFound.set(undefined);
        this.audioFile = undefined;
        this.photos.set([]);

    }
    async sendAudio() {
        if (this.audioFile) {
            return await this.mediaService.uploadAudio(this.audioFile)
        } else {
            return { success: true, data: { paths: undefined } }
        }
    }
    async sendImages() {
        if (this.photos().length > 0) {
            return await this.mediaService.uploadImages(this.photos().map(photo => photo.file))
        } else {
            return { success: true, data: { paths: undefined } }
        }
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}
