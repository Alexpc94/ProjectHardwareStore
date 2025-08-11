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
	@Input() readOnly: boolean = false;
	@Output() locationChanged = new EventEmitter<{ lat: number; lng: number }>();

	private map!: L.Map;

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

		const defaultLat = -21.5338989080539;
		const defaultLng = -64.73426699638368;

		const lat = this.latitude ?? defaultLat;
		const lng = this.longitude ?? defaultLng;

		this.map = L.map('map').setView([lat, lng], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
		}).addTo(this.map);

		// Crear marcador draggable
		const marker = L.marker([lat, lng], { draggable: !this.readOnly }).addTo(this.map);

		marker.bindPopup(this.latitude && this.longitude ? 'Ubicación registrada' : 'Ubicación por defecto').openPopup();

		if (!this.readOnly) {
			marker.on('dragend', (e: any) => {
				const newLatLng = e.target.getLatLng();
				this.locationChanged.emit({ lat: newLatLng.lat, lng: newLatLng.lng });
			});
		}
	}
}
