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
	get pages() {
		const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
		return Array.from({ length: totalPages }, (_, i) => i + 1);
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
