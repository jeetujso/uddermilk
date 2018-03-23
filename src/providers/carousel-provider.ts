import { Injectable } from '@angular/core';

@Injectable()
export class CarouselProvider {
    slides = [
        { image: 'assets/img/slides/s1.jpg' },
        { image: 'assets/img/slides/s2.jpg' },
        { image: 'assets/img/slides/s3.jpg' },
        { image: 'assets/img/slides/s4.jpg' },
        { image: 'assets/img/slides/s5.jpg' }
    ];

    getSlides() {
        // return this.slides;
        return [
            {image: 'http://uddermilk.com/categories_image/231422pickles.jpg'},
            {image: 'http://uddermilk.com/categories_image/spices.jpg'},
            {image: 'http://uddermilk.com/categories_image/nut butter.jpg'},
            {image: 'http://uddermilk.com/categories_image/IMG_0798.JPG'}
        ]
    }

}
