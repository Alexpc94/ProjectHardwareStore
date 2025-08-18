import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ListRentalSectorsComponent } from '../sectors/list-rental-sectors/list-rental-sectors.component';

@Component({
	selector: 'app-list-rentals',
	imports: [AngularSvgIconModule, ListRentalSectorsComponent],
	templateUrl: './list-rentals.component.html',
	styleUrl: './list-rentals.component.css',
})
export class ListRentalsComponent {}
