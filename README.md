# Near.B Owner Application for Android

## Requirements

- [React Native](https://facebook.github.io/react-native/docs/getting-started.html)
- [Node.js](https://nodejs.org/en/download/)
- [ADB](https://developer.android.com/studio/command-line/adb.html)
- [Android Studio, SDK, NDK and SDK Manager] (https://developer.android.com/studio/index.html)

## First time setup

Setup your `ANDROID_HOME`, `ANDROID_NDK` and `adb` path correctly.

After following the installation steps from [React Native](https://facebook.github.io/react-native/docs/getting-started.html)
page (with the recommended addons of Watchman, Flow and GradleDaemon) run `npm install` to download all the required modules.

Connect your device and run `adb reverse --no-rebind tcp:8081 tcp:8081` to allow the connection of the device to the
node server using the usb cable.

Once the app is running, shake the device to enter the dev menu and enable live reloading of the JS code.

## Run the app
```
react-native run-android
npm start
```

### Checking if everything worked

Besides seeing the application loading in the phone, you can see the logs running the following command in the projects root folder:

`adb logcat | grep ReactNativeJS`


### Troubleshooting

##### 1. Cannot reach server

When connected via an USB cable, run `adb reverse --no-rebind tcp:8081 tcp:8081`, and make sure you executed `npm start`
If connected via wifi, check the official react native docs.


##### 2. Content not updated

Shake the device to enter the Dev Menu and enable live reloading.
