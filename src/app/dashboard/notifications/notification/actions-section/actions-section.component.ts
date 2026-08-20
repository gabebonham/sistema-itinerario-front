import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Address } from '../../../../models/address';
import { Debtor } from '../../../../models/debtor';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-actions-section',
    imports: [MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './actions-section.component.html',
})
export class ActionsSectionComponent {
    debtor = input<Debtor>();
    private fb = inject(FormBuilder);
    form = this.fb.group({
        notificatorName: ['', Validators.required],
        debtorName: ['', Validators.required],
        protocol: ['', Validators.required],
        installmentsNumber: [0, [Validators.required, Validators.min(1)]],
    });
}
