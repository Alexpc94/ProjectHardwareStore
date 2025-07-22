import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TableFilterService {
	searchField = signal<string>('');
	orderField = signal<string>('');

	constructor() {}
}
