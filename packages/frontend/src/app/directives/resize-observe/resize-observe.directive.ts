import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[appResizeObserve]',
  standalone: true,
})
export class ResizeObserveDirective implements OnDestroy, AfterViewInit {
  @Output()
  resizeEvent: EventEmitter<{height: number, width: number}> = new EventEmitter();

  private observer: ResizeObserver;

  constructor(private elementRef: ElementRef) {
    this.observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const {height, width} = entries[0].contentRect;
      this.resizeEvent.emit({height, width});
    });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.elementRef.nativeElement);
  }
}
