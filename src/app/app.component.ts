/**
 * AppComponent is the root component that stitches together the Map, Stepper, and replay control.
 *
 * @selector amb-root
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationService } from './core/services/simulation.service';
import { MapComponent } from './features/map/map.component';
import { StepperComponent } from './shared/components/stepper/stepper.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'amb-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, MapComponent, StepperComponent, MatButtonModule, MatIconModule]
})
export class AppComponent {
  /**
   * Injected SimulationService to manage the simulation state and actions.
   */
  protected readonly sim = inject(SimulationService);
}
