import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {DisplayTools} from '../comon/display';
import {CouchDbServices} from '../../providers/couch/couch';
import {ModelDetailPage} from '../model-detail/model-detail';
import {ModelEditorPage} from '../model-editor/model-editor';
declare var pdfMake: any;

@Component({
  templateUrl: 'build/pages/models/models.html',
  providers: [DisplayTools, CouchDbServices]
})
export class ModelsPage {
  models: any = [];
  totModels:any = 0;
  docDefinition: any;
  dataTable:any={"nom":"GAUTIER","prenom":"Thierry"};
  constructor(private navCtrl: NavController, private display: DisplayTools, private db: CouchDbServices, private events: Events) {
    this.models = [];
    this.loadModels();
    this.events.subscribe('modelModify', eventData => {
      this.loadModels();
    });
  }
  loadModels(refresher?) {
    let loader = this.display.displayLoading("", 5);
    this.db.getDbDocs("pdf_models", 100, 0).then(response => {
      //console.log(response);
      this.models = response['rows'];
      this.totModels = response['total_rows'];
      if (refresher) refresher.complete();
      loader.dismiss();
    }, error => {
      loader.dismiss();
      console.log(error);
      this.display.displayToast("Serveur indisponible");
      if (refresher) refresher.complete();

    })
  }
  doRefresh(refresher) {
    this.loadModels(refresher);
  }
  editItem(item) {
    console.log("Call detail with data");
    if (item === 'new') {
      this.navCtrl.push(ModelDetailPage, { "id": this.db.guid(), "model": null });
    } else {
      this.navCtrl.push(ModelDetailPage, { "id": item['id'], "model": item });
    }
  }
  callEditor(item) {
    if (item === 'new') {
      this.navCtrl.push(ModelEditorPage, { "id": this.db.guid(), "model": null });
    } else {
      this.navCtrl.push(ModelEditorPage, { "id": item['id'], "model": item });
    }
  }
  deleteItem(item) {
    //console.log(item);
    this.db.deleteDoc("pdf_models", item.doc).then(response => {
      //console.log(response);
      this.display.displayToast("Modèle supprimé");
      this.loadModels();
    }, error => {
      console.log(error);
      this.display.displayToast(error);
    });
  }
  loadPdf(item) {
    console.log(item);
    var docDefinition = item['doc'];
    docDefinition["footer"] = function (currentPage, pageCount) {
      return {
        text: "Page " + currentPage.toString() + "/" + pageCount,
        alignment: "center"
      };
    };
    docDefinition["header"] = function (currentPage, pageCount) {
      // you can apply any logic and return any valid pdfmake element
      return {
        text: "Groupe SMA",
        alignment: (currentPage % 2) ? "left" : "right"
      };
    };
    docDefinition["background"] = function (currentPage) {
      return {
        text: "Texte de fond sur la page" + currentPage,
        alignment: "center",
        color:(currentPage % 2) ? "blue" : "red"
      };
    }
    docDefinition["content"]=this.mergeData(docDefinition["content"],this.dataTable);
    pdfMake.createPdf(docDefinition).open();
  }
  mergeData(doc:any,data:any){
    var sDoc=JSON.stringify(doc);
    for (let key in data){
      //console.log(key,data[key],Object.keys(data[key])[0]);
      let search="##"+key+"##";
      sDoc=sDoc.replace(new RegExp(search, 'g'), data[key]);
    }
    return JSON.parse(sDoc);
  }
}
