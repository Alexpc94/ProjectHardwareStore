import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListContractsComponent } from './components/OwnershipsContractComponents/list-contracts/list-contracts.component';
import { ListRetalContainersComponent } from './components/retailContainerComponents/list-retal-containers/list-retal-containers.component';

const routes: Routes = [
	{ path: 'Contracts', component: ListContractsComponent },
	{ path: 'retail-containers', component: ListRetalContainersComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ContractsRoutingModule {}
