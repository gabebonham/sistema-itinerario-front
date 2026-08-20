import { Component, computed, effect, EventEmitter, inject, Input, input, model, OnInit, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../models/user';
import { NotificatorEntryComponent } from './notificator-entry/notificator-entry.component';

@Component({
    selector: 'app-notificators-section',
    standalone: true,
    imports: [MatIconModule, NotificatorEntryComponent],
    templateUrl: './notificators-section.component.html',
})
export class NotificatorsSection {
    isLoading = input.required<boolean>();

    notificators = input.required<User[]>();
    notificatorEntries = signal<User[]>([])

    constructor() {
        effect(()=>{
            this.notificatorEntries.set(this.notificators())
        })
    }

    deleteNotificator(id: string) {
        this.notificatorEntries.set(this.notificatorEntries().filter(notificator => notificator.id != id))
    }
}