import {DestroyRef, Injectable} from '@angular/core';
import {Event, NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import {BehaviorSubject, filter, map, pairwise} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {META_TAGS, PATHS} from '../../../constants/constants';
import {MetaService} from '../meta/meta.service';

@Injectable({providedIn: 'root'})
export class RoutesService {
  private routes$ = new BehaviorSubject<{prevRoute: string; curRoute: string}>({prevRoute: '', curRoute: ''});

  getRoutesSync() {
    return this.routes$.value;
  }

  constructor(private router: Router, private destroyRef: DestroyRef, private metaService: MetaService) {}

  init() {
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof RoutesRecognized),
        pairwise(),
        map(([prevRoute, curRoute]) => ({
          prevRoute: (prevRoute as RoutesRecognized)?.urlAfterRedirects,
          curRoute: (curRoute as RoutesRecognized)?.urlAfterRedirects,
        })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(routes => {
        this.routes$.next(routes);
      });

    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(route => {
        const predefinedPath = PATHS[(route as NavigationEnd).urlAfterRedirects.slice(1).toUpperCase()];

        if (predefinedPath) {
          const nonMandatoryMetaTags = new Map();
          nonMandatoryMetaTags.set(META_TAGS['og:type'], 'website');

          if (predefinedPath.metaData.customTags) {
            predefinedPath.metaData.customTags = new Map([...predefinedPath.metaData.customTags, ...nonMandatoryMetaTags]);
          } else {
            predefinedPath.metaData.customTags = nonMandatoryMetaTags;
          }
        }

        this.metaService.updateMetaData(predefinedPath?.metaData);
      });
  }
}
