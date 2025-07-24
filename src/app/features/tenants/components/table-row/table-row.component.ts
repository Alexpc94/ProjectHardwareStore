import { Component, Input, ViewChild, Output, EventEmitter, inject } from '@angular/core';

import { tenant } from '../../models/tenant.model';

@Component({
	selector: '[app-table-row]',
	imports: [],
	templateUrl: './table-row.component.html',
	styleUrl: './table-row.component.css',
})
export class TableRowComponent {
	@Input() tenant!: tenant;
}
