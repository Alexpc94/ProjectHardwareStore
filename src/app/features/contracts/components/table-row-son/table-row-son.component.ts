import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ContractDetail } from '../../models/contracts.model';

@Component({
	selector: '[app-table-row-son]',
	imports: [AngularSvgIconModule],
	templateUrl: './table-row-son.component.html',
	styleUrl: './table-row-son.component.css',
})
export class TableRowSonComponent {
	@Input() contractDetail!: ContractDetail;
}
