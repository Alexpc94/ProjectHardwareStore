import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListBusisnessSectorsComponent } from './components/list-busisness-sectors/list-busisness-sectors.component';

const routes: Routes = [{ path: 'BSectors', component: ListBusisnessSectorsComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BusinessSectosRoutingModule {}
