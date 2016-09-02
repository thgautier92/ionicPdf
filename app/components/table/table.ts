import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {IONIC_DIRECTIVES,Events} from 'ionic-angular';

import {Focuser} from "../../components/focuser/focuser";

export class DataTable {
  constructor(
    public headerRows: number,
    public numberCol: number,
    public widths: any,
    public body: any
  ) { }
}
@Component({
  selector: 'tablePdf',
  templateUrl: 'build/components/table/table.html',
  directives: [IONIC_DIRECTIVES, Focuser]
})
/* Design format
table: 
{
  // headers are automatically repeated if the table spans over multiple pages
  // you can declare how many rows should be treated as headers
  headerRows: 1,
  widths: [ '*', 'auto', 100, '*' ],
  body: [
    [ 'First', 'Second', 'Third', 'The last one' ],
    [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
    [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
  ]
}
*/
export class TableContent {
  form: FormGroup;
  formBody: FormGroup;
  default: any;
  colsWidths: any;
  rows: any = [];
  @Input('init') data: DataTable;
  @Input('idx') idx: any;
  constructor(private fb: FormBuilder, private events:Events) {
    this.default = new DataTable(1, 4,
      ['*', 'auto', 100, '*'],
      ['First', 'Second', 'Third', 'The last one']);
    this.form = fb.group({
      headerRows: ['', Validators.required],
      numberCol: ['', Validators.required],
      widths: ['']
    });
    this.formBody = fb.group({});
    this.rows = [];
    let defrows = [
      ['Titre 1', 'Titre 2', 'Titre 3', 'Titre 4', 'Titre 5'],
      ['10', 20, 30, 40, 50],
      ['10', 20, 30, 40, 50],
      ['10', 20, 30, 40, 50]
    ]
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.rows = this.data['table']['body'];
      //this.form.controls['numberCol'].value = 4;
      let bodyForm = new FormGroup({});
      for (let x in this.rows) {
        for (let y in this.rows[x]) {
          let ctrl = new FormControl(this.rows[x][y]);
          bodyForm.addControl(x + "-" + y, ctrl);
        }
      }
      this.formBody = bodyForm;
      //this.form.addControl("body",bodyForm);
      console.log(this.form);

    });
  }
  logForm(evt: Event) {
    //console.log(evt, this.form.value, this.formBody.value);
    //Calculate the number of row and cols
    let xNum = 0;let yNum = 0;
    for (let el in this.formBody.value) {
      let ref = el.split("-");
      let x = +ref[0];
      let y = +ref[1];
      if (x !== xNum) { xNum = x }
      if (y !== yNum) { yNum = y }
    }
    let bodyArr = [];
    for (let x=0;x<=xNum;x++){
      let xRow=[];
      for (let y=0;y<=yNum;y++){
        xRow.push(this.formBody.controls[x+'-'+y].value);  
      }
      bodyArr.push(xRow);
    }
    let ret = this.form.value;
    ret['numberCol']=yNum+1;
    ret['body'] = bodyArr;
    console.log(ret);
    this.events.publish('contentChange',{table:ret});
    event.preventDefault();
  }

  resetData() {
    this.ngAfterViewInit();
  }
  resetColumns(numberCol) {
    let wd = [];
    for (let i = 0; i <= numberCol; i++) {
      wd.push['*'];
    }
    this.data.widths = wd;
  }
}
