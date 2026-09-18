import {
  Component,
  DOCUMENT,
  ElementRef,
  Inject,
  QueryList,
  ViewChild,
  ViewChildren,
  Input,
  signal
} from '@angular/core';
import { gsap } from "gsap";
import { ImageSliderBox } from './image-slider-box/image-slider-box';
import { ImageSliderTrailItem } from './image-slider-trail-item/image-slider-trail-item';

@Component({
  imports: [ImageSliderBox, ImageSliderTrailItem],
  selector: 'app-image-slider',
  styleUrl: './image-slider.scss',
  templateUrl: './image-slider.html',
})
export class ImageSlider {
  @ViewChild('slider') slider!: ElementRef;
  @ViewChildren('trailItem') trail!: QueryList<ElementRef>;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public ngAfterViewInit() {
    // Add function to all trails
    this.document.querySelectorAll('svg').forEach((cur) => {
      // Assign function based on the class Name("next" and "prev")
      cur.addEventListener('click', () =>
        cur.classList.contains('next') ? this.slide('increase') : this.slide('decrease'),
      );
    });
  }

  @Input() boxes!: ImageSliderBox[];
  // Transform value
  public value: number = 0;

  // interval (Duration)
  public interval: number = 4000;
  public activeBoxId = signal(1);
  protected start = setInterval(() => this.slide('increase'), this.interval);

  protected updateActiveBox(activeBoxId: number) {
    let newBoxId;
    if (activeBoxId > this.boxes.length){
      newBoxId = 1
    }
    else if (activeBoxId <= 0){
        newBoxId = this.boxes.length;
    }
    else {
        newBoxId = activeBoxId;
    }
    this.activeBoxId.set(newBoxId);

    clearInterval(this.start);
    // Get selected trail

    this.value = this.computeTransformationIndex()
    // transfrom slide
    this.move(this.value);
    // start animation
    this.animate();
    // start interval
    this.start = setInterval(() => this.slide('increase'), this.interval);
  }

  // Function to slide forward
  protected slide = (condition: string): void => {
    // update value and trailValue
    condition === 'increase' ? this.initiateINC() : this.initiateDEC();
    // Restart Animation
    this.animate();
    // start interal for slides back
  };

  // function for increase(forward, next) configuration
  protected initiateINC = (): void => {
    let newBoxId = this.activeBoxId() + 1;
    this.updateActiveBox(newBoxId);
  };

  // function for decrease(backward, previous) configuration
  protected initiateDEC = (): void => {
    let newBoxId = this.activeBoxId() - 1;
    this.updateActiveBox(newBoxId);
  };

  protected computeTransformationIndex(){
    const index = this.activeBoxId() - 1;
    return index * 100;
  }

  // function to transform slide
  protected move = (S: number): void => {
    // transform slider
    this.slider.nativeElement.style.transform = `translateX(-${S}%)`;
  };

  protected tl = gsap
    .timeline({ defaults: { duration: 0.6, ease: 'power2.inOut' } })
    .from('.bg', { x: '-100%', opacity: 0 })
    .from('p', { opacity: 0 }, '-=0.3')
    .from('h1', { opacity: 0, y: '30px' }, '-=0.3')
    .from('button', { opacity: 0, y: '-40px' }, '-=0.8');

  // function to restart animation
  protected animate = () => this.tl.restart();

  // Mobile touch Slide Section
  protected touchSlide = () => {
    let start: number;
    let move: number;
    let change: number;
    let sliderWidth: number;

    // Do this on initial touch on screen
    this.slider.nativeElement.addEventListener('touchstart', (e: any) => {
      // get the touche position of X on the screen
      start = e.touches[0].clientX;
      // (each slide with) the width of the slider container divided by the number of slides
      sliderWidth = this.slider.nativeElement.clientWidth / this.trail.length;
    });

    // Do this on touchDrag on screen
    this.slider.nativeElement.addEventListener('touchmove', (e: any) => {
      // prevent default function
      e.preventDefault();
      // get the touche position of X on the screen when dragging stops
      move = e.touches[0].clientX;
      // Subtract initial position from end position and save to change variabla
      change = start - move;
    });

    const mobile = (_: any) => {
      // if change is greater than a quarter of sliderWidth, next else Do NOTHING
      change > sliderWidth / 4 ? this.slide('increase') : null;
      // if change * -1 is greater than a quarter of sliderWidth, prev else Do NOTHING
      change * -1 > sliderWidth / 4 ? this.slide('decrease') : null;
      // reset all variable to 0
      [start, move, change, sliderWidth] = [0, 0, 0, 0];
    };
    // call mobile on touch end
    this.slider.nativeElement.addEventListener('touchend', mobile);
  };

}
