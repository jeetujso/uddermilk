import { Component, Input, SimpleChanges } from '@angular/core';
import { Config } from '../../providers/config';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-img',
    templateUrl: './app-img.html'
})
export class AppImg {

    @Input() public src: string;
    public img = new Image();
    public imageLoaded: boolean = false;
    
    constructor(public config: Config, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.initImg();
    }

    initImg() {
        this.img.onload = () => {
            this.imageLoaded = true;
        };
        this.img.src = this.src;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.src && !changes.src.isFirstChange()) {
            this.img = new Image();
            this.imageLoaded = false;
            this.initImg();
        }
    }

    sanitize(url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

}
