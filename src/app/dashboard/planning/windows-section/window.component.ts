import { Component, effect, inject, input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Attempt } from '../../../models/attempt';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewWindowModal } from '../add-window-modal/new-window-modal.component';

@Component({
    selector: 'app-window',
    imports: [MatSidenavModule, MatIconModule],
    templateUrl: './window.component.html',
})
export class WindowComponent {
    possibleWindows: string[] = ['Manhã', 'Tarde', 'Sábado'];
    windowsLeft: string[] = [];
    attemptTakenWindows: Attempt[] = [];
    attempts = input<Attempt[]>([]);

    constructor(private dialog: MatDialog) {
        effect(() => {
            const attempts = this.attempts();
            if (attempts.length > 0) {
                this.attemptTakenWindows = this.getAttemptsInAscOrder(attempts);
                this.windowsLeft = this.possibleWindows.filter(window =>
                    !this.attemptTakenWindows.map(a => a.window).includes(window));
            } else {
                this.attemptTakenWindows = [];
                this.windowsLeft = this.possibleWindows;
            }
        });
    }

    openModal() {
        const ref = this.dialog.open(NewWindowModal, {
            width: '1200px',
            height: '380px',
            data: { windowsLeft:this.windowsLeft }
        });
        ref.afterClosed().subscribe(result => console.log(result));
    }

    getAttemptsInAscOrder(attempts: Attempt[]) {
        return [...attempts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    getTime(date: Date): string {
        return date.getHours() + ':' + date.getMinutes();
    }

    getFormattedDate(date: Date): string {
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    }
}