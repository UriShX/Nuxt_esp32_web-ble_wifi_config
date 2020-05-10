# ESP32_WiFi_config_over_BLE

>

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# ESP32 WiFi config over web-ble

## General description

As the name implies, it is a web based app used to configure wifi credentials over Bluetooth LE.
The app interacts with the esp32 using web-ble, so is available atm (02/2020) on Chrome browsers, on OSX Yosemite and later, Windows 10, Linux with required bluez version etc., and Android > 6.0.

## Requirements

**Update, 23/02/2020:** _I have released an extension of Bernd's sketch, which provides both WiFi connection status and a list of access points seen by the esp32 device, check it out at:_ https://github.com/UriShX/esp32_wifi_ble_advanced. \
The app relies on communication with the esp32 device based on [Bernd Giesecke's ESP32 WiFi configuration over BLE](https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/), and intends to replace the native Android Java app Bernd used. That is so it may be useable on a broader range of machines - essentially, every modern PC from the last few years (that has a working BLE interface), and Android devices ([click here for current implementation status](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)).
Sadly, there is no support atm for iOS devices, though I believe it can be possible to achieve with nativescript.

#### JS libraries and CSS used:

- [Knockout JS](https://knockoutjs.com/)
- ~~[BluetoothTerminal](https://github.com/loginov-rocks/bluetooth-terminal) (out of sheer laziness). A bit modified, and it works.~~ Replaced with a [custom file](https://github.com/UriShX/esp32_web-ble_wifi_config/blob/master/scripts/espconfig.js) created using [get Started with Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator/), a web-ble boilerplate code generator app.
- [JQuery](https://jquery.com/)
- [Sammy JS](http://sammyjs.org/)
- [Bootstrap 4 & associated libs](https://getbootstrap.com/)

##### _Notices_

- geo_spoof.js is used to prevent the BLE connection from asking permission to use geolocation services
- App uses Bernd's UUID's to maintain usability.
- App also searches for devices with a name that starts with "ESP32", and does not display other devices.

## TODO

- Make app progressive.
- Expand usability. That is probably the most important of all - keep current usability, while adding features such as:
  - ~~Getting connection status from device via notification.~~ Done. Works with my modified code found [here](https://github.com/UriShX/esp32_wifi_ble_advanced).
  - ~~Getting a list of SSIDs seen by device.~~ Done. Works with my modified code found [here](https://github.com/UriShX/esp32_wifi_ble_advanced).
  - Setting up a device password and authentication scheme, so not everyone can get to the device and read passwords stored on it.

### Further goals:

- Create different configurations based on connection method:
  1. Replace Knockout with Vue? Whatever works for getting the app to compile as native iOS & Android apps.
  2. Replace Bootsrap 4 with a lighter CSS framework, so that app can be embedded in the device, and be used as captive portal for WiFi configuration (without BLE).
