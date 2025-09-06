import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListRentalsComponent } from './components/list-rentals/list-rentals.component';
import { ListBusisnessSectorsComponent } from './../business-sectors/components/list-busisness-sectors/list-busisness-sectors.component';

const routes: Routes = [
	{ path: 'sectors', component: ListRentalsComponent },
	{ path: 'Bsectors', component: ListBusisnessSectorsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentalsRoutingModule {}
