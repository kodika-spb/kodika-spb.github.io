import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { SigninPage } from '../pages/signin/signin';

const config = {
  apiKey: "AIzaSyBM-uppOQCysXG_s_zKjaLzc1r9uxWce8k",
  authDomain: "simple-chat-52607.firebaseapp.com",
  databaseURL: "https://simple-chat-52607.firebaseio.com",
  projectId: "simple-chat-52607",
  storageBucket: "simple-chat-52607.appspot.com"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      setTimeout(() => {
        splashScreen.hide();
      }, 2000);
    });
    firebase.initializeApp(config);
  }
}
