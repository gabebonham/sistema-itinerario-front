import { Component, effect, inject, input, output, signal } from '@angular/core';
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
    windowsLeft = signal<string[]>([]);
    isLoading = input.required<boolean>()
    takenWindows = signal<WindowEntry[]>([]);
    diligences = input<Diligence[]>([]);

    newWindowEntry = signal<WindowEntry | undefined>(undefined);
    buildWindow = output<WindowEntry>()
    ready = output()
    constructor(private dialog: MatDialog) {
        effect(() => {
            const diligences = this.diligences();
            if (diligences.length > 0) {
                const taken = this.getDiligencesInAscOrder(diligences)
                    .map(diligence => this.mapToWindowEntry(diligence))
                this.windowsLeft.set(this.possibleWindows.filter(window =>
                    !taken.map(a => a.window).includes(window)));
                this.takenWindows.set(taken);
            } else {
                this.takenWindows.set([]);
                this.windowsLeft.set(this.possibleWindows);
            }
        });
    }


    openModal() {
        const ref = this.dialog.open(NewWindowModal, {
            width: '1200px',
            height: '380px',
            data: { windowsLeft: this.windowsLeft(), diligenceOrdinal: this.getDiligenceOrdinal() }
        });
        ref.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            if (result.success) {
                this.newWindowEntry.set({
                    finish: result.data.finish,
                    new: result.data.new,
                    start: result.data.start,
                    window: result.data.window,
                    diligenceOrdinal: result.data.diligenceOrdinal
                })
                this.buildWindow.emit(this.newWindowEntry()!)
                this.ready.emit()
            }
        });
    }
    getDiligenceOrdinal(): DiligenceOrdinal {
        if (this.takenWindows().length == 0) {
            return '1ª Diligência'
        } else if (this.takenWindows().length == 1) {
            return '2ª Diligência'
        } else {
            return '3ª Diligência'
        }
    }

    getDiligencesInAscOrder(diligences: Diligence[]) {
        return [...diligences].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
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
    getTime(date: Date | string | undefined): string {
        if (!date) {
            return '';
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return '';
        }

        return `${String(parsedDate.getHours()).padStart(2, '0')}:${String(
            parsedDate.getMinutes()
        ).padStart(2, '0')}`;
    }
    getFormattedDate(date: Date | string | undefined): string {
        if (!date) {
            return '';
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return '';
        }

        return parsedDate.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long'
        });
    }
    onDeleteNewWindow() {
        this.takenWindows.set(this.takenWindows().filter(window => !window.new))
        this.newWindowEntry.set(undefined)
    }
}