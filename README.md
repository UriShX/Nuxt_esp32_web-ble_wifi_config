# Nuxt.JS esp32 WiFi configuration over Bt-LE

## General description

A web based app used to configure WiFi credentials over Bluetooth LE, for esp32 based IoT projects. Check it out _[here](https://urishx.github.io/Nuxt_esp32_web-ble_wifi_config/)_. \
The app is written in NuxtJS, a Vue framework for server side rendered apps. This is a recreation of the app, which was originally written using KnockoutJS and JQuery. The reason for recreating the app was that having the BLE config. and connection parts as Nuxt / Vue Components can help integrate them further into more complex web applications. \
The app interacts with the esp32 using web-ble, which is a web standard under development. Thus, it is available atm (02/2020) only on Chrome browsers, on OSX Yosemite and later, Windows 10, Linux with required bluez version etc., and Android > 6.0. [click here for current implementation status](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)

## Requirements

The app relies on communication with a esp32 based device / dev board, set up to support configuration of mutiple APs over BLE. Check it out _[here](https://urishx.github.io/Nuxt_esp32_web-ble_wifi_config/)_. \
Such an app can be found at: https://github.com/UriShX/esp32_wifi_ble_advanced, written in PlatformIO with the Arduino framework. The esp32 app complements this web app in functionality, and supports writing, reading, as well as both WiFi connection status and a list of access points seen by the esp32 device. \
The communication with the esp32 device is based on [Bernd Giesecke's ESP32 WiFi configuration over BLE](https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/), and intends to replace the native Android Java app Bernd used. It also expands on Bernd's original use to support connection status reporting and passing a list of SSIDs seen by the esp32. \
Sadly, there is no support atm for iOS devices, though I believe it can be possible to achieve with nativescript.

## Build Setup

Bluetooth-LE requires a secure connection over HTTPS. For development, the `nuxt.config.js` file contains links to [server key and certificate files](https://letsencrypt.org/docs/certificates-for-localhost/#making-and-trusting-your-own-certificates), [according to Nuxt's documentation](https://nuxtjs.org/api/configuration-server#example-using-https-configuration). The files should either be stored in `~/ssl/`, or the `server` tag in `nuxt.config.js` should be edited to fit. \
 \
This app was set up to be deployed to [github pages](https://pages.github.com/), according to Nuxt's [guide](https://nuxtjs.org/faq/github-pages#__layout). The `dist` folder is white-listed in `.gitignore`, and can be easily pushed to `gh-pages` branch. More details can be found [here](https://gist.github.com/belohlavek/61dd16c08cd9c57a168408b9ac4121c2).

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project for github pages deployment
$ npm run generate:gh-pages

# push dist folder to github pages
$ git subtree push --prefix dist origin gh-pages
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

#### JS libraries and CSS used:

- A custom class, stored in [espconfig.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/assets/espconfig.js), was created using [get Started with Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator/), a web-ble boilerplate code generator app. \
  The class is linked to the Nuxt app as a [client rendered](https://nuxtjs.org/guide/plugins/#name-conventional-plugin), [root injected](https://nuxtjs.org/guide/plugins/#inject-in-root-amp-context) plugin, which is found [here](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/plugins/espconfig.client.js).
- [BootstrapVue](https://bootstrap-vue.org/) was used in order to keep the design similar to the previous iteration of the app, which used Bootstrap 4.
- [Vuelidate](https://vuelidate.js.org/) was used to ensure SSID and password fields are not blank before passing the credentials to the device.
- [Material design icons](https://material.io/resources/icons/?style=baseline) were used throughout, for ease of use in development, through [nuxt-material-icons](https://github.com/anteriovieira/nuxt-material-design-icons).

##### _Other_

- [geo_spoof.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/static/geo_spoof.js) is used to prevent the BLE connection from asking permission to use geolocation services. _App still requests location services on Android_.
- [navigatorCheck.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/assets/navigatorCheck.js) contains the method used to check the users' OS and browser for compatibilty with the web-bluetooth standard.
- App uses the UUIDs Bernd Giesecke's used in his original app to maintain backward compatibility.
- App searches only for devices with a name that starts with "ESP32", and does not display other devices.

## TODO

- Check geolocation spoofing. Android still requests turning on location services, and in testing returns the function from [geo_spoof.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/static/geo_spoof.js). Not sure if the values are accepted by the navigator.
- Nuxt app
- Make app progressive using [Nuxt PWA](https://pwa.nuxtjs.org/).
- Setting up a device password and authentication scheme, so not everyone can get to the device and read passwords stored on it.

### Further goals:

1. Replace Bootsrap with either a lighter CSS framework, or a pure CSS / CSS extension language such as Sass.
1. Create native Android and iOS apps using [nativescript-vue](https://nativescript-vue.org/en/docs/getting-started/code-sharing/).
