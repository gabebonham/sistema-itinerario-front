import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';

import { ATTEMPT_STATUS, DILIGENCE_WINDOW, DILIGENCES } from '../../attempt/constants/constants';
import { AttemptsFilterService } from '../../../services/attempts-filter.service';

@Component({
    selector: 'app-attempts-filtered-search',
    standalone: true,
    imports: [MatIconModule, MatSelectModule, MatFormFieldModule, MatInputModule],
    templateUrl: './attempts-filtered-search.component.html',
})
export class AttemptFilteredSearchComponent {
    private filterService = inject(AttemptsFilterService);

    diligences = DILIGENCES.OPTIONS;
    windows = DILIGENCE_WINDOW.OPTIONS;
    statuses = ATTEMPT_STATUS

    selectedDiligence: string = this.diligences[0];
    selectedWindow: string = this.windows[0];
    searchDebtorValue: string = '';
    searchProtocolValue: string = '';
    toDateValue: string = '';
    fromDateValue: string = '';
    private debtorSearch$ = new Subject<string>();
    private protocolSearch$ = new Subject<string>();
    constructor() {
        this.debtorSearch$
            .pipe(debounceTime(300))
            .subscribe(value => {
                this.filterService.updateFilter({
                    debtorName: value
                });
            });

        this.protocolSearch$
            .pipe(debounceTime(300))
            .subscribe(value => {
                this.filterService.updateFilter({
                    protocol: value
                });
            });
    }

    onSearchDebtorInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchDebtorValue = value;
        this.debtorSearch$.next(value);
    }
    onSearchProtocolInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchProtocolValue = value;
        this.protocolSearch$.next(value);
    }

    onFromDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;

        this.fromDateValue = value;
        input.value = value;

        this.filterService.updateFilter({ from: value });
    }

    onToDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;

        this.toDateValue = value;
        input.value = value;

        this.filterService.updateFilter({ to: value });
    }
}