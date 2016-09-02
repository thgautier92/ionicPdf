import { Component } from '@angular/core';
import { Page, NavController, NavParams, Events } from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl} from '@angular/common';

import {ParagraphContent} from '../../components/paragraph/paragraph';
import {TableContent} from '../../components/table/table';

import {DisplayTools} from '../comon/display';
import {DataServices} from '../../providers/data/data';
import {CouchDbServices} from '../../providers/couch/couch';
import {KeyByPosPipe} from '../../pipes/common';
declare var pdfMake: any;

/*
  Generated class for the MenuDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/model-detail/model-detail.html',
  providers: [CouchDbServices, DataServices, DisplayTools],
  directives: [ParagraphContent, TableContent],
  pipes: [KeyByPosPipe]
})
export class ModelDetailPage {
  data: any;
  dataEdit: any;
  content: any;
  contentType:any;
  modelId: any;
  modelTitle: any;
  addModel: Boolean = false;
  default: any;
  lstType: any = ["text", "table", "columns"];
  constructor(private nav: NavController, private navParams: NavParams, private events: Events, private fb: FormBuilder, private couch: CouchDbServices, private dataServices: DataServices, private display: DisplayTools) {
    this.dataEdit = [];
    this.modelTitle = "";
    this.data = navParams.get('model');
    this.modelId = navParams.get('id');
    this.addModel = (this.data ? false : true);
    // Get the default value of the doc
    this.dataServices.getDefault("doc").then(response => {
      console.log("Default values loaded", response);
      this.default = response;
      this.dataEdit = (this.data ? this.data.doc : this.default);
      this.content = this.dataEdit['content'];
      this.contentType=[];
      for (let key in this.content) {this.contentType.push(Object.keys(this.content[key])[0]);}
      this.modelTitle = this.dataEdit.info.title;
    }, error => {
      console.log(error);
      this.default = {};
      this.dataEdit = (this.data ? this.data.doc : this.default);
      this.content = this.dataEdit['content'];
      this.contentType=[];
      for (let key in this.content) {this.contentType.push(Object.keys(this.content[key])[0]);}
      this.modelTitle = this.dataEdit.info.title;
    })
    this.events.subscribe("contentChange",eventData=>{
      this.content.push(eventData[0]);
      this.contentType.push(Object.keys(eventData[0])[0]);
    })
  }
  ngAfterViewInit() { }

  create(typeContent) {
    console.log(typeContent);
    this.dataServices.getDefault(typeContent).then(response => {
      console.log("Default values loaded", response);
      this.events.publish('contentChange',response);
    }, error => {
      console.log(error);
    })
  }
  // Operation on Paragraph
  deletePar(idx) {
    console.log("Delete a content ", idx)
    this.content.splice(idx, 1);
    this.contentType.splice(idx, 1);
  }
  // Save an update or a new model
  saveItem(evt) {
    let newData = this.dataEdit;
    newData.info.title = this.modelTitle;
    newData.content=this.content;
    newData['_id'] = this.modelId;
    if (!this.addModel) {
      newData['_rev'] = this.data.value['rev'];
    }
    this.couch.addDoc("pdf_models", newData, null, null).then(response => {
      //console.log(response);
      this.display.displayToast("Modèle modifié");
      this.events.publish("modelModify");
      this.nav.pop();
    }, error => {
      let err = JSON.parse(error['_body']);
      this.display.displayToast(err['error'] + " : " + err['reason']);
    });
  }
  cancel() {
    this.nav.pop();
  }
}