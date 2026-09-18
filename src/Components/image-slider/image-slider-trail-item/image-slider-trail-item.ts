import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-image-slider-trail-item',
  styleUrl: './image-slider-trail-item.scss',
  templateUrl: './image-slider-trail-item.html',
})
export class ImageSliderTrailItem {
  @Input() boxId!: number;
  @Input() isActive: boolean = false;
  @Output() trailMustUpdate = new EventEmitter();

  protected handleClick(): void {
    this.trailMustUpdate.emit(this.boxId);
  }
}
