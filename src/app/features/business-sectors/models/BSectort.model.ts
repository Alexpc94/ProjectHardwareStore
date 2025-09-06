export interface BSector {
	codc: string;
	nombre: string;
	estado: number;
	tipo: number;
	deta: string;
	hijo?: BSector;
}
