import { MenuItem } from '../models/menu.model';

export class Menu {
	public static pages: MenuItem[] = [
		{
			group: 'Base',
			separator: false,
			items: [
				{
					icon: 'assets/icons/heroicons/outline/cube.svg',
					label: 'Home',
					route: '/home',
					children: [{ label: 'Table', route: '/home/table' }],
				},
				{
					icon: 'assets/icons/heroicons/outline/lock-closed.svg',
					label: 'Usuarios',
					route: '/home',
					children: [{ label: 'Data', route: '/home/table' }],
				},
				{
					icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
					label: 'Errors',
					route: '/errors',
					children: [
						{ label: '404', route: '/errors/404' },
						{ label: '500', route: '/errors/500' },
					],
				},
			],
		},
		{
			group: 'Collaboration',
			separator: true,
			items: [
				{
					icon: 'assets/icons/heroicons/outline/download.svg',
					label: 'Download',
					route: '/download',
				},
				{
					icon: 'assets/icons/heroicons/outline/gift.svg',
					label: 'Logos',
					route: '/logos',
				},
				{
					icon: 'assets/icons/heroicons/outline/users.svg',
					label: 'Users',
					route: '/users',
				},
			],
		},
		{
			group: 'Config',
			separator: false,
			items: [
				{
					icon: 'assets/icons/heroicons/outline/cog.svg',
					label: 'Settings',
					route: '/settings',
				},
				{
					icon: 'assets/icons/heroicons/outline/bell.svg',
					label: 'Notifications',
					route: '/gift',
				},
				{
					icon: 'assets/icons/heroicons/outline/folder.svg',
					label: 'Folders',
					route: '/folders',
					children: [
						{ label: 'Current Files', route: '/folders/current-files' },
						{ label: 'Downloads', route: '/folders/download' },
						{ label: 'Trash', route: '/folders/trash' },
					],
				},
			],
		},
	];
}
