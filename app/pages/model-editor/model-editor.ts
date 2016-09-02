import { Component } from '@angular/core';
import { Page, NavController, NavParams, Events } from 'ionic-angular';
import {CouchDbServices} from '../../providers/couch/couch';
import {DisplayTools} from '../comon/display';
declare var JSONEditor: any;
/*
  Generated class for the ModelEditorPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/model-editor/model-editor.html',
  providers: [CouchDbServices, DisplayTools],
})
export class ModelEditorPage {
  editor: any;
  modelId: any;
  data: any;
  dataEdit: any;
  constructor(private navCtrl: NavController, private navParams: NavParams, private events: Events, private couch: CouchDbServices, private display: DisplayTools) {
    this.editor = null;
    this.data = navParams.get('model');
    this.modelId = navParams.get('id');
    this.dataEdit = this.data.doc;
  }
  ngAfterViewInit() {
    this.createEditor();
  }
  createEditor() {
    var container = document.getElementById("jsoneditor");
    var options = {
      mode: 'tree',
      modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      onError: function (err) {
        alert(err.toString());
      },
      onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
      }
    };
    this.editor = new JSONEditor(container, options);
    this.editor.set(this.dataEdit);
  };
  // Save an update or a new model
  saveItem(evt) {
    let newData = this.editor.get();
    newData['_rev'] = this.data.value['rev'];
    this.couch.addDoc("pdf_models", newData, null, null).then(response => {
      //console.log(response);
      this.display.displayToast("Modèle modifié");
      this.events.publish("modelModify");
      this.navCtrl.pop();
    }, error => {
      let err = JSON.parse(error['_body']);
      this.display.displayToast(err['error'] + " : " + err['reason']);
    });
  }
  cancel() {
    this.navCtrl.pop();
  }

}
