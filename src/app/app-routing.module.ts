import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './core/modules/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		canActivate: [authGuard],
		children: [
			{
				path: 'home',
				loadChildren: () => import('./core/modules/uikit/uikit.module').then((m) => m.UikitModule),
			},
		],
	},
	{ path: 'home', redirectTo: '' },
	{
		path: 'auth',
		loadChildren: () => import('./core/modules/auth/auth.module').then((m) => m.AuthModule),
	},
	{
		path: '**',
		loadChildren: () => import('./core/modules/error/error.module').then((m) => m.ErrorModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
