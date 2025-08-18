import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListRentalsComponent } from './components/list-rentals/list-rentals.component';

const routes: Routes = [{ path: 'sectors', component: ListRentalsComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentalsRoutingModule {}
