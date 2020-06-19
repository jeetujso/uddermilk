import { Injectable } from '@angular/core';

@Injectable()
export class CarouselProvider {

    getSlides() {
        return [
            {image: 'https://uddermilk.com/categories_image/cows%20cheese.jpg'},
            {image: 'https://uddermilk.com/categories_image/meat%20fresh.jpg'},
            {image: 'https://uddermilk.com/categories_image/231422pickles.jpg'},
            {image: 'https://uddermilk.com/categories_image/spices.jpg'},
        ]
    }

}
