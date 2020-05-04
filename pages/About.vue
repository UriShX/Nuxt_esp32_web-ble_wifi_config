<template>
  <b-container fluid>
    <b-row>
      <b-col cols="1" class="ml-2">
        <b-navbar v-b-scrollspy:reltive-pos class="flex-column">
          <b-nav pills small vertical>
            <b-nav-item to="#about">About</b-nav-item>
            <b-nav-item to="#description">Description</b-nav-item>
            <b-nav-item to="#usage">Usage</b-nav-item>
          </b-nav>
        </b-navbar>
      </b-col>
      <b-col col cols="1"></b-col>
      <b-col col cols="9" class="ml-2">
        <div id="reltive-pos">
          <h2 id="about" class="mb-6">About</h2>
          <p>
            A web-ble implementation of Bernd Giesecke's
            <a
              href="https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/"
            >
              ESP32 WiFi configuration over BLE
            </a>
            . Bernd's control app is Android only, while web-ble is being
            developed as a web standard, and is available currently (05/2020) on
            Chrome for OSX, Windows 10, and Android ( more details on
            implementation status can be found
            <a
              href="https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md"
            >
              here</a
            >
            ).
          </p>
          <p>
            The repository for this app is hosted on github
            <a href="https://github.com/UriShX/esp32_web-ble_wifi_config"
              >here</a
            >.
          </p>
          <h3 id="description" class="mb-6">Description</h3>
          <descript />
          <h3 id="usage" class="mb-1">Usage</h3>
          <p>
            Press the "Connect" button at the top right corner. The app searches
            for BLE devices with a name that starts with "ESP32", and has a
            predefined service UUID. Select the desired device from the device
            selection menu, and press "Pair". Once paired, the app requests the
            credentials stored in the device's memory. Once recieved, the app
            populates the SSID and password fields from the data recieved from
            the ESP32 device. You can then edit the desired fields, and then
            press the "Configure device" button to send the new configuration to
            the ESP32. Two more buttons are also provided: "Erase" - to erase
            the current configured SSIDs and associated passwords, and "Reset" -
            to reset the device when needed. Once done with the configuration,
            click "Disconnect", and the stored SSIDs and credentials will be
            saved in the device's flash memory.
            <br />
            <i>
              Notice: In order to configure WiFi credentials over BLE, an ESP32
              device must be prepared with
              <a
                href="https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/"
              >
                beegee1962's app
              </a>
              beforehand.
            </i>
          </p>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Descript from '~/components/Description'

export default {
  components: {
    Descript
  },
  head() {
    return { title: 'About: ESP32 configuration tool built w/ Nuxt.js' }
  }
}
</script>

<style scoped>
#reltive-pos {
  align-self: right;
  position: relative;
  height: 30em;
  overflow-y: scroll;
}
</style>
