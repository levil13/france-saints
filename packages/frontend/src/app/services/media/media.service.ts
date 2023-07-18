import {DestroyRef, Injectable} from '@angular/core';
import {debounceTime, distinctUntilChanged, fromEvent, map, Observable, shareReplay, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ResizeEvent} from 'leaflet';

export enum MEDIA {
  DESKTOP = 'DESKTOP',
  DESKTOP_SM = 'DESKTOP_SM',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE',
}

@Injectable({providedIn: 'root'})
export class MediaService {
  media$!: Observable<MEDIA>;

  constructor(private destroyRef: DestroyRef) {}

  init() {
    this.media$ = fromEvent<ResizeEvent>(window, 'resize').pipe(
      debounceTime(300),
      map((event: ResizeEvent) => this.calculateMedia(event.target.innerWidth)),
      startWith(this.calculateMedia(window.innerWidth)),
      distinctUntilChanged(),
      shareReplay(),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private calculateMedia(innerWidth: number) {
    if (innerWidth > 1279) {
      return MEDIA.DESKTOP;
    } else if (innerWidth > 1023) {
      return MEDIA.DESKTOP_SM;
    } else if (innerWidth > 767) {
      return MEDIA.TABLET;
    } else {
      return MEDIA.MOBILE;
    }
  }
}
