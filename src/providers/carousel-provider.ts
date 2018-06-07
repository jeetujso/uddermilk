import { Injectable } from '@angular/core';

@Injectable()
export class CarouselProvider {

    getSlides() {
        return [
            {image: 'http://uddermilk.com/categories_image/231422pickles.jpg'},
            {image: 'http://uddermilk.com/categories_image/spices.jpg'},
            {image: 'http://uddermilk.com/categories_image/nut butter.jpg'},
            {image: 'http://uddermilk.com/categories_image/IMG_0798.JPG'}
        ]
    }

}
