# Build Ionic 3, Angular 5 and Firebase Simple Chat App

How to run:

* install NodeJS
* install Android Studio
* make sure env var ANDROID_HOME is set
* run
```
npm install -g cordova ionic
npm install
ionic cordova platform rm android
ionic cordova platform add android
$ANDROID_HOME/tools/bin/sdkmanager "system-images;android-25;google_apis;x86"
$ANDROID_HOME/tools/bin/avdmanager create avd --name simple-chat -k 'system-images;android-25;google_apis;x86'
ionic cordova run android
ionic cordova build android
```

This source code is part of [Build Ionic 3, Angular 5 and Firebase Simple Chat App](https://www.djamware.com/post/5a629d9880aca7059c142976/build-ionic-3-angular-5-and-firebase-simple-chat-app) tutorial.

You can modify `src/app/app.component.ts` then change Firebase parameters to meet your Firebase account
