import {Directive, Renderer, ElementRef} from '@angular/core';
 
@Directive({
    selector: '[focuser]' // Attribute selector
})
export class Focuser {
    constructor(private renderer:Renderer, private elementRef:ElementRef) {
    }
    ngAfterViewInit() {
        const element = this.elementRef.nativeElement.querySelector('input');
        console.log(element);
        // we need to delay our call in order to work with ionic ...
        setTimeout(() => {
            this.renderer.invokeElementMethod(element, 'focus', []);
        }, 0);
    }
}