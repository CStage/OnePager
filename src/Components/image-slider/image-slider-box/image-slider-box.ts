import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  imports: [NgClass],
  selector: 'app-image-slider-box',
  styleUrl: './image-slider-box.scss',
  templateUrl: './image-slider-box.html',
})
export class ImageSliderBox {
  @Input() boxId!: number;
  @Input() header!: string;
  @Input() description!: string;
  @Input() buttonText!: string;
}

export interface ImageSliderBoxData {
  boxId: number;
  header: string;
  description: string;
  buttonText: string;
}
