import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListContractsComponent } from './components/list-contracts/list-contracts.component';

const routes: Routes = [{ path: 'Contracts', component: ListContractsComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ContractsRoutingModule {}
