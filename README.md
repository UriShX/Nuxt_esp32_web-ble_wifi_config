# Nuxt.JS esp32 WiFi configuration over Bt-LE

## General description

A web based app used to configure WiFi credentials over Bluetooth LE (BLE), for esp32 based IoT projects. Check it out _[here](https://urishx.github.io/Nuxt_esp32_web-ble_wifi_config/)_. \
The app is written in NuxtJS, a Vue framework for server side rendered apps. This is a recreation of the app, which was originally written using KnockoutJS and JQuery. The main reason for recreating the app was that having the BLE configuration and connection parts as Nuxt / Vue Components can help integrate them further into more complex web applications. \
The app interacts with the esp32 using web-bluetooth, which is a web standard under development. Thus, it is available atm (02/2020) only on Chrome browsers, on OSX Yosemite and later, Windows 10, Linux with required bluez version etc., and Android > 6.0. [Click here for current implementation status](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)

## Requirements

The app relies on communication with a esp32 based device / dev board, set up to support configuration of mutiple APs over BLE. Check it out _[here](https://urishx.github.io/Nuxt_esp32_web-ble_wifi_config/)_. \
The Arduino script can be found at: https://github.com/UriShX/esp32_wifi_ble_advanced, written in PlatformIO (with the Arduino framework). The esp32 app complements this web app in functionality, and supports writing, reading, as well as both WiFi connection status and a list of access points seen by the esp32 device. \
The communication with the esp32 device is based on [Bernd Giesecke's ESP32 WiFi configuration over BLE](https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/), and intends to replace the native Android Java app Bernd used. It also expands on Bernd's original use to support connection status reporting and passing a list of SSIDs seen by the esp32. \
Sadly, there is no support atm for iOS devices, though I believe it can be possible to achieve with nativescript.

#### JS libraries and CSS used:

- A custom class, stored in [espconfig.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/assets/espconfig.js), was created using [get Started with Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator/), a web-ble boilerplate code generator app. \
  The class is linked to the Nuxt app as a [client rendered](https://nuxtjs.org/guide/plugins/#name-conventional-plugin), [root injected](https://nuxtjs.org/guide/plugins/#inject-in-root-amp-context) plugin, which is found [here](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/plugins/espconfig.client.js).
- [BootstrapVue](https://bootstrap-vue.org/) was used in order to keep the design similar to the previous iteration of the app, which used Bootstrap 4.
- [Vuelidate](https://vuelidate.js.org/) was used to ensure SSID and password fields are not blank before passing the credentials to the device.
- [Material design icons](https://material.io/resources/icons/?style=baseline) were used throughout, for ease of use in development, through [nuxt-material-icons](https://github.com/anteriovieira/nuxt-material-design-icons).

## App features and configuration

- The app does not allow the user to change the visibility of passwords recieved from the esp32 device, as well as accessing the passwords from the console using elment access. Control of this feature is done in [InputPair.vue](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/components/InputPair.vue).
- The Arduino sketch for the esp32 requires both SSID and password to be set, for both the primary and secondary fields. Validation is set to require all fields to have content, unless "Configure Secondary SSID" is set to OFF and both the secondary SSID and password fields are blank (and the primary ones have content) - in which case the primary fields' content will be copied to the secondary. This scheme can be configured in [Config.vue](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/components/Config.vue).
- The communication between the esp32 device and the app is slightly obfuscated by doing a XOR operation of the stringified JSON object with the esp32 device's name. The operation occurs on both the recieve and send operations, and can be found in [string_helpers.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/assets/string_helpers.js), and its calling functions in [Config.vue](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/components/Config.vue).
- The app uses the UUIDs Bernd Giesecke's used in his original app to maintain backward compatibility.
- The app searches only for devices with a name that starts with "ESP32", and does not display other devices.
  - UUIDs and callbacks used by [espconfig.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/assets/espconfig.js) are set in [Navbar.vue](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/components/Navbar.vue).
- [geo_spoof.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/static/geo_spoof.js) is used to prevent the BLE connection from asking permission to use geolocation services. _App still requests location services on Android_.
  - Android v. 6.0 and above requires `ACCESS_COARSE_LOCATION` to be allowed,and `geo_spoof.js` is an attempt to mitigate that by providing a false location in order for the app to work even when geolocation cannot be found by the Android device. More info about this subject can be found in [this dicussion on stackoverflow.com](https://stackoverflow.com/questions/33045581/location-needs-to-be-enabled-for-bluetooth-low-energy-scanning-on-android-6-0). I have not tested it on this particular app, but have used this method with success to control a servo over BLE in a basement with no GPS reception for [another web app](https://github.com/UriShX/ESP32_fader).
- [navigatorCheck.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/assets/navigatorCheck.js) contains the method used to check the users' OS and browser for compatibilty with the web-bluetooth standard.
  - Disabling a "No JavaScript" alert and checking browser and OS for compatibilty is done in [Compatibility.vue](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/components/Compatibility.vue).

## Build Setup

Bluetooth-LE requires a secure connection over HTTPS. For development, the `nuxt.config.js` file contains links to [server key and certificate files](https://letsencrypt.org/docs/certificates-for-localhost/#making-and-trusting-your-own-certificates), [according to Nuxt's documentation](https://nuxtjs.org/api/configuration-server#example-using-https-configuration). The files should either be stored in `~/ssl/`, or the `server` tag in `nuxt.config.js` should be edited to fit. `server.host` is also set as `0.0.0.0`, to allow testing and debugging on connected Android device through local network. \
 \
This app was set up to be deployed to [github pages](https://pages.github.com/), according to Nuxt's [guide](https://nuxtjs.org/faq/github-pages#__layout). Since the app was built to be static, the `generate.subFolders` property in `nuxt.config,js` was [set to false, to generate separate files](https://nuxtjs.org/api/configuration-generate/#subfolders) for each of the pages. The `dist` folder is white-listed in `.gitignore`, and can be easily pushed to `gh-pages` branch. More details can be found [here](https://gist.github.com/belohlavek/61dd16c08cd9c57a168408b9ac4121c2).

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production
$ npm run build

# generate static project for github pages deployment
$ npm run generate:gh-pages

# push dist folder to github pages
$ git subtree push --prefix dist origin gh-pages
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## TODO

- [ ] Check geolocation spoofing. Android still requests turning on location services, and in testing returns the function from [geo_spoof.js](https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config/blob/master/static/geo_spoof.js). Not sure if the values are accepted by the navigator. This should be checked in an environment where geolocation is not available, such as a basement.
- [ ] Make app progressive using [Nuxt PWA](https://pwa.nuxtjs.org/).
- [ ] Replace Bootsrap with either a lighter CSS framework, or a pure CSS / CSS extension language such as Sass.

### Further goals:

- Create native Android and iOS apps using [nativescript-vue](https://nativescript-vue.org/en/docs/getting-started/code-sharing/).
- Setting up a device password and authentication scheme, so not everyone can get to the device and read passwords stored on it.
