export interface ContractDetail {
	importe: number;
	rubro: string;
}

export interface contract {
	codcon: string;
	gestion: number;
	fechaini: Date;
	fechafin: Date;
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
	rubro: string;
	predio: string;
	dcontratos: ContractDetail[];
}
