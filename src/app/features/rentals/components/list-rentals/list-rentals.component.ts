import { Component, signal, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ListRentalSectorsComponent } from '../sectors/list-rental-sectors/list-rental-sectors.component';
import { ListRentalSectionsComponent } from '../sections/list-rental-sections/list-rental-sections.component';
import { ListRentalOwnershipsComponent } from '../ownerships/list-rental-ownerships/list-rental-ownerships.component';

import { RentalService } from '../../services/rentals.service';

@Component({
	selector: 'app-list-rentals',
	imports: [
		AngularSvgIconModule,
		ListRentalSectorsComponent,
		ListRentalSectionsComponent,
		ListRentalOwnershipsComponent,
	],
	templateUrl: './list-rentals.component.html',
	styleUrl: './list-rentals.component.css',
})
export class ListRentalsComponent {
	_getRentalService = inject(RentalService);
	selectedView = signal<'all' | 'sectores' | 'secciones' | 'predios'>('all');

	onBack() {
		// Aquí puedes definir qué acción hacer al volver, por ejemplo:
		console.log('Volver presionado');
		// o redirigir a otra vista:
		// this._getRentalService.setView('predios', 0);
	}
}
