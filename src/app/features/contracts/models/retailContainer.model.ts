export interface reatailContainerDetail {
	id_daco: number;
	importe: number;
	rubro: string;
	estado: number;
}

export interface reatailContainer {
	coda: string;
	gestion: number;
	estado: number;
	monto: number;
	obs: string;
	contador: number;
	cf: number;
	fecha: Date;
	stop: number;
	fechareg: Date;
	inquilino: string;
	persona_resp: string;
	dacoplados: reatailContainerDetail[];
}
