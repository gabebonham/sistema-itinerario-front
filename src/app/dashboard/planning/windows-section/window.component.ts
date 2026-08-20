import { Component, effect, inject, input, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewWindowModal } from './add-window-modal/new-window-modal.component';
import { Diligence, DiligenceOrdinal, WindowEntry } from '../../../models/diligence';

@Component({
    selector: 'app-window',
    imports: [MatSidenavModule, MatIconModule],
    templateUrl: './window.component.html',
})
export class WindowComponent {
    possibleWindows: string[] = ['Manhã', 'Tarde', 'Sábado'];
    windowsLeft: string[] = [];
    isLoading = input.required<boolean>()
    takenWindows: WindowEntry[] = [];
    diligences = input<Diligence[]>([]);
    constructor(private dialog: MatDialog) {
        effect(() => {
            const diligences = this.diligences();
            if (diligences.length > 0) {
                this.takenWindows = this.getDiligencesInAscOrder(diligences)
                    .map(diligence => this.mapToWindowEntry(diligence));
                this.windowsLeft = this.possibleWindows.filter(window =>
                    !this.takenWindows.map(a => a.window).includes(window));
            } else {
                this.takenWindows = [];
                this.windowsLeft = this.possibleWindows;
            }
        });
    }

    newWindowEntry = signal<WindowEntry | undefined>(undefined);


    openModal() {
        const ref = this.dialog.open(NewWindowModal, {
            width: '1200px',
            height: '380px',
            data: { windowsLeft: this.windowsLeft, diligenceOrdinal: this.getDiligenceOrdinal() }
        });
        ref.afterClosed().subscribe(result => {
            if (result.success) {
                this.newWindowEntry.set({
                    finish: result.data.finish,
                    new: result.data.new,
                    start: result.data.start,
                    window: result.data.window,
                    diligenceOrdinal: result.data.diligenceOrdinal
                })
            }
        });
    }
    getDiligenceOrdinal(): DiligenceOrdinal {
        if (this.takenWindows.length == 0) {
            return '1ª Diligência'
        } else if (this.takenWindows.length == 1) {
            return '2ª Diligência'
        } else {
            return '3ª Diligência'
        }
    }

    getDiligencesInAscOrder(diligences: Diligence[]) {
        return [...diligences].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    mapToWindowEntry(diligence: Diligence): WindowEntry {
        return {
            finish: diligence.finish,
            start: diligence.start,
            new: false,
            window: diligence.window,
            diligenceOrdinal: diligence.diligenceOrdinal
        }
    }

    getTime(date: Date): string {
        return date.getHours() + ':' + date.getMinutes();
    }

    getFormattedDate(date: Date): string {
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    }
    onDeleteNewWindow() {
        this.takenWindows = this.takenWindows.filter(window => !window.new)
        this.newWindowEntry.set(undefined)
    }
}