import { Injectable } from '@angular/core';
import { HTTP_PROVIDERS, Http, Request, RequestMethod, Headers, RequestOptions } from '@angular/http';
import {Storage, LocalStorage} from 'ionic-angular';

import 'rxjs/add/operator/map';
const defaultParams = { "srv": "cdb.gautiersa.fr", "user": "tgautier", "password": "Tga051163", "base": "demo" };

/*
  Generated class for the CouchDb provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CouchDbServices {
  data: any = null;
  dataRequest: any = null;
  credHeaders: Headers;
  local: Storage = new Storage(LocalStorage);
  constructor(public http: Http) {
    this.credHeaders = new Headers();
    this.credHeaders.append('Content-Type', 'application/json');
    this.credHeaders.append('Accept', 'application/json;charset=utf-8');
    this.credHeaders.append('Authorization', 'Basic ' + window.btoa(defaultParams.user + ':' + defaultParams.password))
  }

  getParams() {
    return defaultParams;
  }
  // Verify if the user exist
  getUser(userId, params) {
    return new Promise((resolve, reject) => {
      if (!params) params = defaultParams;
      var rootUrl = 'http://' + params.srv + '/_users/org.couchdb.user:' + userId;
      this.credHeaders.delete('Authorization');
      this.credHeaders.append('Authorization', 'Basic ' + window.btoa(params.user + ':' + params.password))
      var options = new Request({
        method: RequestMethod.Get,
        headers: this.credHeaders,
        url: rootUrl
      });
      this.http.request(options)
        .map(res => {
          console.log(res);
          res.json();
        })
        .subscribe(data => {
          this.dataRequest = data;
          resolve(this.dataRequest);
        }, error => {
          console.log("USER : User request error", error);
          if (typeof (error._body) === "string") {
            reject(JSON.parse(error._body));
          } else {
            reject({ error: "Erreur de connexion", reason: "L'utilisateur n'est pas reconnu." });
          }
        });
    });
  }
  openSession(userData, params) {
    return new Promise((resolve, reject) => {
      if (!params) params = defaultParams;
      var rootUrl = 'http://' + params.srv + '/_session';
      this.credHeaders.delete('Authorization');
      this.credHeaders.append('Authorization', 'Basic ' + window.btoa(params.user + ':' + params.password));
      let options = new Request({
        method: RequestMethod.Post,
        headers: this.credHeaders,
        body: JSON.stringify(userData),
        url: rootUrl
      });
      this.http.request(options)
        .subscribe(res => {
          //console.log(res);
          this.dataRequest = res.json();
          var headers = res.headers;
          var setCookieHeader = headers.get('Set-Cookie');
          this.local.set('id_user', JSON.stringify(this.dataRequest));
          resolve(this.dataRequest);
        }, error => {
          console.log("USER : User request error", error);
          if (typeof (error._body) === "string") {
            reject(JSON.parse(error._body));
          } else {
            reject({ error: "Erreur de connexion", reason: "L'utilisateur n'est pas reconnu." });
          }
        });
    });
  };
  verifSession(extend?) {
    return new Promise((resolve, reject) => {
      this.local.get('id_user').then(data => {
        if (data !== null) {
          let d = JSON.parse(data);
          let r = d['roles'];
          let isAdmin = r.filter(item => item === '_admin');
          if (isAdmin.length == 0) {
            d['isAdmin'] = false;
          } else {
            d['isAdmin'] = true;
          }
          if (extend) {
            resolve(d);
          } else {
            resolve(d['ok']);
          }
        } else {
          reject(false);
        }
      }), error => {
        reject(error);
      };
    })
  }
  closeSession() {
    this.local.remove('id_user');
  }
  // Create a user entrie
  putUser(userData, params) {
    return new Promise((resolve, reject) => {
      if (!params) params = defaultParams;
      var rootUrl = 'http://' + params.srv + '/_users/org.couchdb.user:' + userData.name;
      this.credHeaders.delete('Authorization');
      this.credHeaders.append('Authorization', 'Basic ' + window.btoa(params.user + ':' + params.password));
      userData.roles = ['user']
      userData.type = "user";
      let options = new Request({
        method: RequestMethod.Put,
        headers: this.credHeaders,
        body: JSON.stringify(userData),
        url: rootUrl
      });
      this.http.request(options)
        .map(res => res.json())
        .subscribe(
        data => {
          resolve(data);
        }, error => {
          console.log("USER : User request error", error);
          if (typeof (error._body) === "string") {
            reject(JSON.parse(error._body));
          } else {
            reject({ error: "Erreur de connexion", reason: "L'utilisateur n'est pas reconnu." });
          }
        });
    });
  }
  /* ==============================
  * Bases operations
  * ============================== */
  // Create a base
  createBase(key, params) {
    return new Promise((resolve, reject) => {
      if (!params) params = defaultParams;
      //console.log("HTTP Params :", params);
      var rootUrl = 'http://' + params.srv + '/' + key;
      this.credHeaders.delete('Authorization');
      this.credHeaders.append('Authorization', 'Basic ' + window.btoa(params.user + ':' + params.password))
      //console.log("HTTP Hearder :", this.credHeaders);
      var options = new Request({
        method: RequestMethod.Put,
        headers: this.credHeaders,
        url: rootUrl
      });
      this.http.request(options)
        .map(res => res.json())
        .subscribe(
        data => {
          resolve(data);
        }, error => {
          //console.log("PROVIDER : Request error", error);
          if (typeof (error._body) === "string") {
            reject(error);
          } else {
            reject({ error: "Erreur de connexion", reason: "Le site n'est pas accessible" });
          }
        });
    });
  }
  // Return bases list
  getDabases(key, params) {
    return new Promise((resolve, reject) => {
      if (!params) params = defaultParams;
      //console.log("HTTP Params :", params);
      var rootUrl = 'http://' + params.srv + '/' + key;
      this.credHeaders.delete('Authorization');
      this.credHeaders.append('Authorization', 'Basic ' + window.btoa(params.user + ':' + params.password))
      //console.log("HTTP Hearder :", this.credHeaders);
      var options = new Request({
        method: RequestMethod.Get,
        headers: this.credHeaders,
        url: rootUrl
      });
      this.http.request(options)
        .map(res => res.json())
        .subscribe(
        data => {
          resolve(data);
        }, error => {
          console.log("PROVIDER : Request error", error);
          if (typeof (error._body) === "string") {
            reject(error);
          } else {
            reject({ error: "Erreur de connexion", reason: "Le site n'est pas accessible" });
          }
        });
    });
  }
  // Return paginate list
  getDbDocs(base, range, skip) {
    return new Promise((resolve, reject) => {
      var rootUrl = 'http://' + defaultParams.srv + '/' + base + '/_all_docs?include_docs=true&limit=' + range + '&skip=' + skip;
      //console.log("Get server info : " + rootUrl);
      var options = new Request({
        method: RequestMethod.Get,
        headers: this.credHeaders,
        url: rootUrl
      });
      this.http.request(options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log("Request error");
          reject(error);
        });
    });
  }
  // Return a single doc, with details
  getDbDoc(base, id) {
    return new Promise((resolve, reject) => {
      var rootUrl = 'http://' + defaultParams.srv + '/' + base + '/' + id;
      //console.log("Get server info : " + rootUrl);
      var options = new Request({
        method: RequestMethod.Get,
        headers: this.credHeaders,
        url: rootUrl
      });
      this.http.request(options)
        .map(res => res.json())
        .subscribe(
        data => {
          resolve(data);
        }, error => {
          console.log("Request error", error);
          reject(error);
        });
    })
  }
  addDoc(base, data, params?, file?) {
    return new Promise((resolve, reject) => {
      if (!params) params = defaultParams;
      var id = data['_id'];
      var rootUrl = 'http://' + defaultParams.srv + '/' + base + '/' + id;
      this.credHeaders.delete('Authorization');
      this.credHeaders.append('Authorization', 'Basic ' + window.btoa(params.user + ':' + params.password));
      this.credHeaders.append('Accept', 'application/json;charset=utf-8');
      let options = new RequestOptions({ headers: this.credHeaders });
      this.http.put(rootUrl, JSON.stringify(data), options)
        .map(res => res.json())
        .subscribe(data => {
          //console.log("Data return",data);
          resolve(data);
        }, error => {
          console.log("Request error", error);
          reject(error);
        });
    })
  }
  // Return paginate list of a couchDb View
  getViewDocs(base, view, range, skip) {
    return new Promise((resolve, reject) => {
      //var rootUrl = 'http://' + defaultParams.srv + '/' + base + '/_design/views/_view/'+view+'?include_docs=true&limit=' + range + '&skip=' + skip;
      var rootUrl = 'http://' + defaultParams.srv + '/' + base + '/_design/views/_view/' + view;
      //console.log("Get server info : " + rootUrl);
      var options = new Request({
        method: RequestMethod.Get,
        headers: this.credHeaders,
        url: rootUrl
      });
      this.http.request(options)
        .map(res => res.json())
        .subscribe(
        data => {
          resolve(data);
        }, error => {
          console.log("Request error");
          reject(error);
        });
    });
  }
  deleteDoc(base, item) {
    return new Promise((resolve, reject) => {
      var rootUrl = 'http://' + defaultParams.srv + '/' + base + '/';
      rootUrl = rootUrl + item['_id'] + "?rev=" + item['_rev'];
      //console.log("Get server info : " + rootUrl);
      var options = new Request({
        method: RequestMethod.Delete,
        headers: this.credHeaders,
        url: rootUrl
      });
      this.http.request(options)
        .map(res => res.json())
        .subscribe(
        data => {
          resolve(data);
        }, error => {
          console.log("Request error", error);
          reject(error);
        });
    })
  }
  guid() {
    var sep = "";
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + sep + s4() + sep + s4() + sep +
      s4() + sep + s4() + s4() + s4();
  }
}

