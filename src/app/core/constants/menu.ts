import { MenuItem } from '../models/menu.model';

export class Menu {
	public static pages: MenuItem[] = [
		{
			group: 'Presentacion',
			separator: false,
			items: [
				{
					icon: 'assets/icons/heroicons/outline/cube.svg',
					label: 'Inicio',
					route: '/dashboard',
				},
				{
					icon: 'assets/icons/usericons/calendar-days-svgrepo-com.svg',
					label: 'Calendario',
					route: '/calendar',
				},
			],
		},
		// {
		// 	group: 'Data',
		// 	separator: true,
		// 	items: [
		// 		{
		// 			icon: 'assets/icons/heroicons/outline/download.svg',
		// 			label: 'Download',
		// 			route: '/download',
		// 		},
		// 		{
		// 			icon: 'assets/icons/heroicons/outline/gift.svg',
		// 			label: 'Iconos',
		// 			route: '/logos',
		// 		},
		// 		{
		// 			icon: 'assets/icons/heroicons/outline/users.svg',
		// 			label: 'Users',
		// 			route: '/users',
		// 		},
		// 	],
		// },
		{
			group: 'Config',
			separator: false,
			items: [
				{
					icon: 'assets/icons/heroicons/outline/users.svg',
					label: 'Usuarios',
					route: '/home',
					children: [{ label: 'Data', route: '/home/table' }],
				},
				{
					icon: 'assets/icons/heroicons/outline/bookmark.svg',
					label: 'Iconos',
					route: '/logos',
				},
				{
					icon: 'assets/icons/heroicons/outline/bell.svg',
					label: 'Alertas',
					route: '/gift',
				},
			],
		},
	];
}
