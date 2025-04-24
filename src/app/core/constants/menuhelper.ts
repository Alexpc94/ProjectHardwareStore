import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';

export function generateDynamicMenu(menuData: any[], id_role: number): MenuItem[] {
	if (!Array.isArray(menuData) || !id_role) return [];

	const filteredMenus = menuData.filter((menu) => menu.id_role === id_role);
	const dynamicItems = filteredMenus.map((menu) => ({
		icon: menu.icon,
		label: menu.name,
		route: '/' + menu.submenu?.link,
		children: (menu.submenu || []).map(
			(sub: any): SubMenuItem => ({
				label: sub.name,
				route: '/' + sub.link,
			}),
		),
	}));

	// Menú estático
	const staticGroup: MenuItem = {
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
	};

	// Grupo dinámico
	const dynamicGroup: MenuItem = {
		group: 'Data',
		separator: true,
		items: dynamicItems,
	};

	const staticGroupConfig: MenuItem = {
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
	};

	// Combinamos ambos grupos
	return [staticGroup, dynamicGroup, staticGroupConfig];
}
