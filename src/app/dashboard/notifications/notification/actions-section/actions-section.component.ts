import { Component, inject, input, signal } from '@angular/core';
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

@Component({
    selector: 'app-actions-section',
    imports: [CommonModule, AudioRecorderComponent, MatSnackBarModule, MatIconModule, NgClass, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './actions-section.component.html',
})
export class ActionsSectionComponent {
    private snackBar = inject(MatSnackBar);
    debtor = input<Debtor>();
    diligence = input.required<Diligence | undefined>()
    diligenceService = inject(DiligencesService)
    mediaService = inject(MediaService)
    debtorFound = signal<boolean | undefined>(undefined)
    private fb = inject(FormBuilder);
    isLoading = signal(false)
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
            imageUrls
        };
        this.diligenceService.update(diligenceId, concludeVisitDto)
            .then(result => {
                if (result.success) {
                    this.showToast('Visita concluida com sucesso!');
                    this.router.navigate([`/dashboard/notificacoes`]);
                } else {
                    this.showToast('Não foi possível concluir visita.');
                }
            })
            .catch(err => {
                console.error(err);
                this.showToast('Erro ao concluir visita.');
            })
            .finally(() => {
                this.isLoading.set(false);
            });
    }
    onSaveAudio(audioFile?: File) {
        this.audioFile = audioFile
    }
    async sendAudio() {
        if (this.audioFile) {
            return await this.mediaService.uploadAudio(this.audioFile)
        } else {
            return { success: true, data: { paths: undefined } }
        }
    }
    async sendImages() {
        if (this.photos().length>0) {
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
