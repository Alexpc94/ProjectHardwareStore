import { staff } from 'src/app/features/sistem-data/models/staff.model';

export const dummyData: staff[] = [
	{
		id: 1,
		name: 'Ana',
		firstName: 'Pérez',
		secondName: 'Pérez',
		email: 'ana.perez@example.com',
		telephone: 15551234,
		gender: 'M',
		status: true,
		photo: 'https://example.com/profiles/aperez.jpg',
		datebirth: '1990-04-15',
		cedula: '12345678',
	},
	{
		id: 2,
		name: 'Luis',
		firstName: 'Rodríguez',
		secondName: 'Pérez',
		email: 'luis.rodriguez@example.com',
		telephone: 15555678,
		gender: 'M',
		status: false,
		photo: 'https://example.com/profiles/lrodriguez.jpg',
		datebirth: '1988-07-22',
		cedula: '23456789',
	},
];
