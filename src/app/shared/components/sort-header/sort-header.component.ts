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
			const valA = String(a[this.sortField]).toLowerCase();
			const valB = String(b[this.sortField]).toLowerCase();
			if (valA < valB) return newDir === 'asc' ? -1 : 1;
			if (valA > valB) return newDir === 'asc' ? 1 : -1;
			return 0;
		});

		this.sortedData.emit(sorted);
	}
}
