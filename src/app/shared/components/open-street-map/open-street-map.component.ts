import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import * as L from 'leaflet';

@Component({
	selector: 'app-open-street-map',
	templateUrl: './open-street-map.component.html',
	styleUrls: ['./open-street-map.component.css'], // corregido
})
export class OpenStreetMapComponent implements AfterViewInit {
	@Input() latitude?: number;
	@Input() longitude?: number;

	@Output() locationChanged = new EventEmitter<{ lat: number; lng: number }>();

	private map!: L.Map;
	private marker!: L.Marker;

	ngAfterViewInit(): void {
		// Configura ícono (igual que antes)
		const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
		const iconUrl = 'assets/leaflet/marker-icon.png';
		const shadowUrl = 'assets/leaflet/marker-shadow.png';

		const DefaultIcon = L.icon({
			iconRetinaUrl,
			iconUrl,
			shadowUrl,
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28],
			shadowSize: [41, 41],
		});

		L.Marker.prototype.options.icon = DefaultIcon;

		const defaultLat = -21.5355;
		const defaultLng = -64.7297;

		const lat = this.latitude ?? defaultLat;
		const lng = this.longitude ?? defaultLng;

		this.map = L.map('map').setView([lat, lng], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
		}).addTo(this.map);

		// Crear marcador draggable
		this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

		this.marker
			.bindPopup(
				this.latitude !== undefined && this.longitude !== undefined ? 'Ubicación registrada' : 'Ubicación por defecto',
			)
			.openPopup();

		// Escuchar evento dragend para obtener la nueva ubicación
		this.marker.on('dragend', () => {
			const position = this.marker.getLatLng();
			this.locationChanged.emit({ lat: position.lat, lng: position.lng });
		});
	}
}
