import { Component, OnInit, signal, computed, inject } from '@angular/core';

import { dummyData } from 'src/app/shared/dummy/staff.dummy';
import { staff } from './../../../models/staff.model';
import { TableRowComponent } from '../table-row/table-row.component';

import { TableFilterService } from '../../../services/table-filter.service';
@Component({
	selector: 'app-list-staff',
	imports: [TableRowComponent],
	templateUrl: './list-staff.component.html',
	styleUrl: './list-staff.component.css',
})
export class ListStaffComponent implements OnInit {
	private _filterService = inject(TableFilterService);
	users = signal<staff[]>([]);

	ngOnInit(): void {
		this.users.set(dummyData);
	}

	filteredUsers = computed(() => {
		const search = this._filterService.searchField().toLowerCase();

		return this.users().filter(
			(user) =>
				user.name.toLowerCase().includes(search) ||
				user.lastname.toLowerCase().includes(search) ||
				user.username.toLowerCase().includes(search) ||
				user.email.toLowerCase().includes(search) ||
				user.phone.includes(search),
		);
	});
}
