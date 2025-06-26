/**
 * SimulationService orchestrates the ambulance journey simulation.
 * It emits the ambulance position along a polyline, exposes the current stage,
 * and emits the progress ratio (0–1) for the progress bar.
 */
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { asapScheduler, interval, map, shareReplay, Subscription, take, tap, timer } from 'rxjs';
import * as L from 'leaflet';

@Injectable({ providedIn: 'root' })
export class SimulationService {
  /**
   * Hard-coded route (hospital ➜ accident).
   */
  private readonly line: readonly L.LatLng[] = [
    L.latLng(30.83848, 30.99594), // hospital
    L.latLng(30.81282, 30.98511)  // accident
  ];

  /** Signal representing the current stage of the journey. */
  private readonly stageSig = signal<Stage>('call');

  /** Signal representing the progress ratio (0–1). */
  private readonly ratioSig = signal<number>(0);

  /** Signal representing the current position of the ambulance. */
  private readonly positionSig = signal<L.LatLng>(this.line[0]);

  /** Subscription for the animation process. */
  private animationSub?: Subscription;

  /** Stage as a cold observable. */
  readonly stage$ = toObservable(this.stageSig).pipe(shareReplay(1));

  /** Ratio (0–1) as a cold observable. */
  readonly ratio$ = toObservable(this.ratioSig).pipe(shareReplay(1));

  /** Position for MapComponent as a cold observable. */
  readonly position$ = toObservable(this.positionSig).pipe(shareReplay(1));

  /**
   * Exposes the route polyline to MapComponent.
   * @returns The polyline representing the route.
   */
  get routeLine(): readonly L.LatLng[] {
    return this.line;
  }

  /**
   * Start or restart the ambulance animation.
   */
  restart(): void {
    this.animationSub?.unsubscribe();

    // Hard-reset signals
    this.ratioSig.set(0);
    this.stageSig.set('call');
    this.positionSig.set(this.line[0]);

    // Small visual pause so the 0-state renders
    timer(200).subscribe(() => this.runAnimation());
  }

  /**
   * Runs the animation process.
   */
  private runAnimation(): void {
    const totalFrames = 300; // 5 seconds @ 60 FPS

    this.animationSub = interval(16).pipe(
      take(totalFrames + 1),
      map(frame => frame / totalFrames)
    ).subscribe({
      next: ratio => this.update(ratio),
      complete: () => navigator.vibrate?.(200)
    });
  }


  /**
   * Computes and emits each frame.
   * @param ratio The progress ratio (0–1).
   */
  private update(ratio: number): void {
    this.ratioSig.set(ratio);
    this.stageSig.set(this.stageFromRatio(ratio));
    this.positionSig.set(this.interpolate(ratio));
  }

  /**
   * Performs linear interpolation on the polyline.
   * @param ratio The progress ratio (0–1).
   * @returns The interpolated position.
   */
  private interpolate(ratio: number): L.LatLng {
    const [start, end] = this.line;
    return L.latLng(
      start.lat + (end.lat - start.lat) * ratio,
      start.lng + (end.lng - start.lng) * ratio
    );
  }

  /**
   * Maps the progress ratio to the corresponding stage.
   * @param ratio The progress ratio (0–1).
   * @returns The corresponding stage.
   */
  private stageFromRatio(ratio: number): Stage {
    if (ratio < 0.20) return 'call';     // First 20%
    if (ratio < 0.45) return 'left';     // 20–45%
    if (ratio < 0.95) return 'route';    // 45–95%
    return 'arrived';
  }
}

/**
 * Type representing the possible stages of the journey.
 */
type Stage = 'call' | 'left' | 'route' | 'arrived';
