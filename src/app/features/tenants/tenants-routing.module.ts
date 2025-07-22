import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListTenantsComponent } from './components/list-tenants/list-tenants.component';

const routes: Routes = [{ path: 'tenants', component: ListTenantsComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TenantsRoutingModule {}
