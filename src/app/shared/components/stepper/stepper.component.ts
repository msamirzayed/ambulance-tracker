import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { Observable } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';

/**
 * StepperComponent is a standalone Angular component that displays a stepper UI.
 * It uses Angular Material's stepper and a custom progress bar component.
 *
 * @selector amb-stepper
 * @inputs
 *  - stage$: Observable<Stage> - Represents the current stage of the stepper.
 *  - ratio$: Observable<number> - Represents the progress ratio for the progress bar.
 */
@Component({
  selector: 'amb-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatStepperModule,
    MatIconModule,
    ProgressBarComponent
  ],
  styleUrls: ['./stepper.component.scss'],
  templateUrl: './stepper.component.html',
})
export class StepperComponent implements OnInit {
  /**
   * Observable representing the current stage of the stepper.
   * Required input.
   */
  @Input({ required: true }) stage$!: Observable<Stage>;

  /**
   * Observable representing the progress ratio for the progress bar.
   * Required input.
   */
  @Input({ required: true }) ratio$!: Observable<number>;

  /**
   * Labels for each step in the stepper.
   */
  readonly labels = ['Call Received', 'Left Hospital', 'En Route', 'Arrived'];

  /**
   * Observable representing the completion state of each step.
   */
  completed$!: Observable<boolean[]>;

  /**
   * Initializes the completed$ observable based on the current stage.
   */
  ngOnInit(): void {
    this.completed$ = this.stage$.pipe(
      map(stage => STAGE_TO_IDX[stage]),
      startWith(0),
      distinctUntilChanged(),
      map(idx => [
        true, // First step is always completed.
        idx >= 1, // Second step is completed if idx >= 1.
        idx >= 2, // Third step is completed if idx >= 2.
        idx >= 3  // Fourth step is completed if idx >= 3.
      ])
    );
  }
}

/**
 * Type representing the possible stages of the stepper.
 */
type Stage = 'call' | 'left' | 'route' | 'arrived';

/**
 * Mapping of stages to their corresponding indices in the stepper.
 */
const STAGE_TO_IDX: Record<Stage, number> = {
  call: 0,
  left: 1,
  route: 2,
  arrived: 3
};
