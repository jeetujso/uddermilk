import { Component } from '@angular/core';
import { CarouselProvider } from '../../providers/carousel-provider';

export interface Slide {
  image: string;
}

@Component({
  selector: 'carousel',
  templateUrl: 'carousel.html',
  providers: [CarouselProvider]
})
export class CarouselComponent {
  slides: Slide[];
  text: string;
  animateClass = { 'zoom-in': true };

  constructor(private CarouselProvider: CarouselProvider) {

    /* take images from carousel provider*/
    this.slides = CarouselProvider.getSlides();
  }

}
