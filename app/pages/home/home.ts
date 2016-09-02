import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {DisplayTools} from '../comon/display';
import {DataServices} from '../../providers/data/data';
import {CouchDbServices} from '../../providers/couch/couch';
declare var chance: any;
declare var pdfMake: any;
declare var jsPDF:any;

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [DisplayTools, DataServices, CouchDbServices]
})
export class HomePage {
  models: any = [];
  totModels: any = 0;
  constructor(private navCtrl: NavController, private display: DisplayTools, private dataServices: DataServices, private db: CouchDbServices, private events: Events) {
    this.models = [];
    this.totModels = 0;
  }
  ngAfterViewInit() {

  }

  chanceString() {
    alert(chance.paragraph({ sentences: 1 }));
  }
  createPdf() {
    var docDefinition = {};
    this.dataServices.getData('demo').then(response => {
      console.log(response);
      docDefinition = response;
      docDefinition["footer"] = function (currentPage, pageCount) {
        return {
          text: "Page" + currentPage.toString() + "/" + pageCount,
          alignment: "right"
        };
      };
      docDefinition["header"] = function (currentPage, pageCount) {
        // you can apply any logic and return any valid pdfmake element
        return {
          text: "GroupeSMA",
          alignment: (currentPage % 2) ? "left" : "right"
        };
      };
      docDefinition["background"] = function (currentPage) {
        return {
          text: "simpletextonpage" + currentPage,
          alignment: "right"
        };
      }
      pdfMake.createPdf(docDefinition).open();
    }, error => {
      console.log(error);
      docDefinition = {};
    })
  }
  createJsPdf(){
    var doc = new jsPDF();
  }
}