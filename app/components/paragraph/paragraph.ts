import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {IONIC_DIRECTIVES, Events} from 'ionic-angular';

/*
  Generated class for the paragraph component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

export class DataParagraph {
  constructor(
    public style: string,
    public text: string
  ) { }
}
@Component({
  selector: 'paragraph',
  templateUrl: 'build/components/paragraph/paragraph.html',
  directives: [IONIC_DIRECTIVES],
})
export class ParagraphContent {
  form: FormGroup;
  lstStyles: any = ['none', 'header', 'normal', 'centerItalic'];
  @Input('init') data: DataParagraph;
  @Input('idx') idx: any;
  constructor(fb: FormBuilder, private events:Events) {
    this.form = fb.group({
      style: ['', Validators.required],
      text: ['']
    });
  }
  ngAfterViewInit() {}
  logForm(evt) {
    console.log(evt, this.form.value);
    event.preventDefault();
  }
}
