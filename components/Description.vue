<template>
  <div>
    <p>
      This web app is intended for configuring WiFi credentials of headless IoT
      devices over Bluetooth LE.<br />
      Since the web-bluetooth specification is not finalized yet, only Google
      Chrome was validated to work on Mac OSX, Win 10, Android 9, and Ubuntu
      Linux (with some modifications).<br />
    </p>
    <p>
      To use or test this app you will need a ESP32 dev board which will run a
      matching application.
    </p>
    <p>
      The app allows setting only of password protected Access Points, since it
      was built to complement an existing code base for the Arduino platform.<br />
      The ESP32 works only with 2.4 GHz WiFi, so APs set on other frequencies (5
      GHz, soon 6 GHz) will not be displayed when used in conjunction with ESP32
      based devices.
    </p>
  </div>
</template>
