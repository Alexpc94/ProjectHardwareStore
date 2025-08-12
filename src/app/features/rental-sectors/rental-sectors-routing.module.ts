import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListRentalSectorsComponent } from './components/list-rental-sectors/list-rental-sectors.component';

const routes: Routes = [{ path: 'sectors', component: ListRentalSectorsComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentalSectorsRoutingModule {}
