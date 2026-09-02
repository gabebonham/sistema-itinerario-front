import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';
import { DILIGENCES, DILIGENCE_WINDOW } from '../../constants/constants';
import { AttemptsFilterService } from '../../../../services/attempts-filter.service';
import {  DiligenceOrdinal } from '../../../../models/diligence';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-diligences-filtered-search',
    standalone: true,
    imports: [MatIconModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatCheckboxModule,FormsModule],
    templateUrl: './diligences-filtered-search.component.html',
})
export class DiligencesFilteredSearchComponent {
    private filterService = inject(AttemptsFilterService);

    diligences = DILIGENCES.OPTIONS;
    windows = DILIGENCE_WINDOW.OPTIONS;
    diligenceVisited: boolean = true;
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
    onDiligenceVisitedChange(): void {
        this.filterService.updateFilter({ diligenceVisited: this.diligenceVisited });
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

    onDiligenceChange(): void {
        let selectedOrdinal: DiligenceOrdinal | '';
        if (this.selectedDiligence == '1ª Diligência') {
            selectedOrdinal = '1ª Diligência'
        } else if (this.selectedDiligence == '2ª Diligência') {
            selectedOrdinal = '2ª Diligência'
        } else if (this.selectedDiligence == '3ª Diligência') {
            selectedOrdinal = '3ª Diligência'
        } else {
            selectedOrdinal = ''
        }
        this.filterService.updateFilter({ diligenceOrdinal: selectedOrdinal });
    }

    onWindowChange(): void {
        this.filterService.updateFilter({ window: this.selectedWindow == 'Todas' ? '' : this.selectedWindow });
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