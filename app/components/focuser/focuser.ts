import {Directive, Renderer, ElementRef} from '@angular/core';

/*
  Generated class for the Focuser directive.

  See https://angular.io/docs/ts/latest/api/core/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[focuser]' // Attribute selector
})
export class Focuser {
  constructor() {
    console.log('Hello World');
  }
}