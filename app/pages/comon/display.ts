import {LoadingController, ToastController, AlertController, NavController} from 'ionic-angular';
import {Injectable} from '@angular/core';

@Injectable()
export class DisplayTools {
    constructor(public nav: NavController, private loading: LoadingController, private toastController: ToastController, private alertController: AlertController) {
        this.nav = nav;
    }
    displayLoading(msg, duration?) {
        if (!duration) duration = 5;
        let loading = this.loading.create({ content: msg, duration: duration * 1000 });
        loading.present();
        return loading;
    }
    displayToast(msg) {
        let toast = this.toastController.create({
            message: msg,
            duration: 2000,
            showCloseButton: true,
            closeButtonText: "Fermer",
            dismissOnPageChange: false
        });
        toast.present();
    }
    displayAlert(msg) {
        //console.log(msg);
        setTimeout(() => {
            let alert = this.alertController.create({
                title: 'Message important !',
                subTitle: msg,
                buttons: ["j'ai compris"]
            });
            alert.present();
        }, 100);
    }
    displayJson(el, data) {

    }
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}