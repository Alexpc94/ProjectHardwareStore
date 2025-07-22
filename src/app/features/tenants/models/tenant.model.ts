export interface tenant {
	id: number;
	cedula: string;
	nombre: string;
	ap: string;
	am: string;
	direc: string;
	celular: string;
	ubicacion: string;
	estado: boolean;
	ubicacion_gps?: UbicacionGps;
}

export interface UbicacionGps {
	id: number;
	longitude: number;
	latitude: number;
}
