/**
 * amb-map
 * ────────────────────────────────────────────────────────────────────────────────
 * Leaflet map component that:
 * - Displays a static polyline from hospital ➜ accident
 * - Animates an ambulance marker
 * - Subscribes to live position updates from SimulationService
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { SimulationService } from '../../core/services/simulation.service';

@Component({
  selector: 'amb-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) private mapEl!: ElementRef<HTMLElement>;

  private readonly sim = inject(SimulationService);
  private readonly line = this.sim.routeLine;

  private map!: L.Map;
  private route!: L.Polyline;
  private marker!: L.Marker;

  ngAfterViewInit(): void {
    this.initializeMap();
    this.drawPolyline();
    this.createMarker();
    this.listenForPositionUpdates();
    this.sim.restart(); // Start trip animation
  }

  /** Initialize base Leaflet map */
  private initializeMap(): void {
    this.map = L.map(this.mapEl.nativeElement, {
      zoomControl: false
    }).setView(this.line[0], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  /** Draw route polyline between hospital and accident */
  private drawPolyline(): void {
   this.route = L.polyline([...this.line], {
      weight: 4,
      dashArray: '10,12',
      color: '#d00000'
    }).addTo(this.map);
  }

  /** Create and add the animated ambulance marker */
  private createMarker(): void {
    const icon = L.icon({
      iconUrl: 'ambulance.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    this.marker = L.marker(this.line[0], { icon }).addTo(this.map);
  }

  /** Subscribe to position updates and move marker */
  private listenForPositionUpdates(): void {
    this.sim.position$.subscribe((latLng) => {
      this.marker.setLatLng(latLng);
    });
  }
}
