import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';

/**
 * ProgressBarComponent is a standalone Angular component that displays a progress bar.
 * It uses Angular Material's progress bar and accepts a ratio observable to determine the progress.
 *
 * @selector amb-progress-bar
 * @inputs
 *  - ratio$: Observable<number> - Represents the progress ratio (0–1).
 */
@Component({
  selector: 'amb-progress-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  /**
   * Observable representing the progress ratio (0–1).
   * Required input.
   */
  @Input({ required: true }) ratio$!: Observable<number>;
}
