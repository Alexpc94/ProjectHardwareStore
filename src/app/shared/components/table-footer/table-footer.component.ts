import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
	selector: 'app-table-footer',
	imports: [AngularSvgIconModule],
	templateUrl: './table-footer.component.html',
	styleUrl: './table-footer.component.css',
})
export class TableFooterComponent {
	@Input() totalItems = 0;
	@Input() itemsPerPage = 10;
	@Input() currentPage = 1;

	@Output() pageChange = new EventEmitter<number>();
	@Output() itemsPerPageChange = new EventEmitter<number>();
	get pages(): number[] {
		const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
		const current = this.currentPage;
		const maxVisible = 4;
		const half = Math.floor(maxVisible / 2);

		let start = Math.max(current - half, 1);
		let end = start + maxVisible - 1;

		if (end > totalPages) {
			end = totalPages;
			start = Math.max(end - maxVisible + 1, 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}

	totalPages = computed(() => Math.ceil(this.totalItems / this.itemsPerPage));

	onPreviousPage() {
		if (this.currentPage > 1) this.pageChange.emit(this.currentPage - 1);
	}

	onNextPage() {
		if (this.currentPage < this.totalPages()) this.pageChange.emit(this.currentPage + 1);
	}

	onItemsPerPageChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		const value = Number(selectElement.value);
		this.itemsPerPageChange.emit(value);
	}

	goToPage(page: number) {
		this.pageChange.emit(page);
	}
}
