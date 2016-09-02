import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {IONIC_DIRECTIVES} from 'ionic-angular';

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
  directives: [IONIC_DIRECTIVES]
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
  formTable: FormGroup;
  default: any;
  colsWidths: any;
  rows: any;
  @Input('init') data: DataTable;
  @Input('idx') idx: any;
  constructor(private fb: FormBuilder) {
    this.default = new DataTable(1, 4,
      ['*', 'auto', 100, '*'],
      ['First', 'Second', 'Third', 'The last one']);
    this.form = fb.group({
      headerRows: ['', Validators.required],
      numberCol: ['', Validators.required],
      widths: [''],
      body: ['']
    });
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
      this.form.controls['numberCol'].value = 4;
    });
  }
  logForm(evt) {
    console.log(evt, this.form.value);
    event.preventDefault();
  }
  validData() {
    console.log("Table save", this.rows);
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
  store(x, y, c: Event) {
    c.preventDefault;
    console.log(x, y, c);
    this.rows[x][y] = c.target['value'];
  }
}
