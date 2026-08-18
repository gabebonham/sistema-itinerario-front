import { Component, effect, inject, input, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Attempt, WindowEntry } from '../../../models/attempt';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewWindowModal } from './add-window-modal/new-window-modal.component';

@Component({
    selector: 'app-window',
    imports: [MatSidenavModule, MatIconModule],
    templateUrl: './window.component.html',
})
export class WindowComponent {
    possibleWindows: string[] = ['Manhã', 'Tarde', 'Sábado'];
    windowsLeft: string[] = [];
    takenWindows: WindowEntry[] = [];
    attempts = input<Attempt[]>([]);
    constructor(private dialog: MatDialog) {
        effect(() => {
            const attempts = this.attempts();
            console.log(this.attempts().length)
            if (attempts.length > 0) {
                this.takenWindows = this.getAttemptsInAscOrder(attempts)
                .map(attempt=>this.mapToWindowEntry(attempt));
                this.windowsLeft = this.possibleWindows.filter(window =>
                    !this.takenWindows.map(a => a.window).includes(window));
            } else {
                this.takenWindows = [];
                this.windowsLeft = this.possibleWindows;
            }
        });
    }

    newWindowEntry = signal<WindowEntry|undefined>(undefined);

    
    openModal() {
        const ref = this.dialog.open(NewWindowModal, {
            width: '1200px',
            height: '380px',
            data: { windowsLeft:this.windowsLeft }
        });
        ref.afterClosed().subscribe(result => {
            if (result.success) {
                this.newWindowEntry.set({
                    finish: result.data.finish,
                    new: result.data.new,
                    start: result.data.start,
                    window: result.data.window
            })
            }
        });
    }


    getAttemptsInAscOrder(attempts: Attempt[]) {
        return [...attempts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    mapToWindowEntry(attempt:Attempt): WindowEntry{
        return {
            finish:attempt.finish,
            start:attempt.start,
            new:false,
            window:attempt.window,
        }
    }

    getTime(date: Date): string {
        return date.getHours() + ':' + date.getMinutes();
    }

    getFormattedDate(date: Date): string {
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    }
    onDeleteNewWindow() {
        this.takenWindows = this.takenWindows.filter(window=>!window.new)
        this.newWindowEntry.set(undefined)
    }
}