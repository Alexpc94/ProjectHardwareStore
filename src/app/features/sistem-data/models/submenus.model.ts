export interface submenus {
	id_subm: number;
	name: string;
	description: string;
	link: string;
	status: boolean;
}

export interface assignedSubmenus extends submenus {
	id_mesub: number;
}
