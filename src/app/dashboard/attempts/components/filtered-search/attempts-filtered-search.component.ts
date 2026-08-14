import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';

import { ATTEMPTS_STATUS, ATTEMPTS, ATTEMPTS_WINDOW } from '../../constants/constants';
import { AttemptsFilterService } from '../../../../services/attempts-filter.service';

@Component({
    selector: 'app-attempts-filtered-search',
    standalone: true,
    imports: [MatIconModule, MatSelectModule, MatFormFieldModule, MatInputModule],
    templateUrl: './attempts-filtered-search.component.html',
})
export class AttemptsFilteredSearchComponent {
    private filterService = inject(AttemptsFilterService);

    attempts = ATTEMPTS.OPTIONS;
    statuses = ATTEMPTS_STATUS.OPTIONS;
    windows = ATTEMPTS_WINDOW.OPTIONS;

    selectedStatus: string = this.statuses[0];
    selectedAttempt: string = this.attempts[0];
    selectedWindow: string = this.windows[0];
    searchValue: string = '';
    toDateValue: string = '';
    fromDateValue: string = '';

    private search$ = new Subject<string>();

    constructor() {
        this.search$.pipe(debounceTime(300)).subscribe(value => {
            this.filterService.updateFilter({ search: value });
        });
    }

    onSearchInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchValue = value;
        this.search$.next(value);
    }

    onStatusChange(): void {
        this.filterService.updateFilter({ status: this.selectedStatus });
    }

    onAttemptChange(): void {
        this.filterService.updateFilter({ attempt: this.selectedAttempt });
    }

    onWindowChange(): void {
        this.filterService.updateFilter({ window: this.selectedWindow });
    }

    onFromDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;

        this.fromDateValue = value;
        input.value = value;

        if (value.length === 10) this.filterService.updateFilter({ fromDate: value });
    }

    onToDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;

        this.toDateValue = value;
        input.value = value;

        if (value.length === 10) this.filterService.updateFilter({ toDate: value });
    }
}