import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SortService } from './sort.service';
@Component({
	selector: 'app-sort-header',
	imports: [AngularSvgIconModule],
	templateUrl: './sort-header.component.html',
	styleUrl: './sort-header.component.css',
})
export class SortHeaderComponent {
	@Input() label = '';
	@Input() sortField!: string;
	@Input() data: any[] = [];
	@Output() sortedData = new EventEmitter<any[]>();

	direction = signal<'asc' | 'desc'>('asc');

	constructor(public sortService: SortService) {}

	sortData() {
		const newDir = this.direction() === 'asc' ? 'desc' : 'asc';
		this.direction.set(newDir);
		this.sortService.activeSortField.set(this.sortField);

		const sorted = [...this.data].sort((a, b) => {
			const valA = a[this.sortField];
			const valB = b[this.sortField];

			const emptyA = valA === null || valA === undefined || valA === '';
			const emptyB = valB === null || valB === undefined || valB === '';

			if (emptyA && emptyB) return 0;
			if (emptyA) return 1;
			if (emptyB) return -1;

			const strA = String(valA).toLowerCase();
			const strB = String(valB).toLowerCase();

			if (strA < strB) return newDir === 'asc' ? -1 : 1;
			if (strA > strB) return newDir === 'asc' ? 1 : -1;

			return 0;
		});

		this.sortedData.emit(sorted);
	}
}
