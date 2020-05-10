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
            <a href="https://github.com/UriShX/Nuxt_esp32_web-ble_wifi_config"
              >here</a
            >. As implied by it's name, this web app was written using
            <a href="https://nuxtjs.org/">NuxtJS</a>, a VueJS framework.
          </p>
          <p>
            An older version of this app, based on KnockdownJS and JQuery can be
            found
            <a href="https://github.com/UriShX/esp32_web-ble_wifi_config"
              >here.</a
            >
          </p>
          <p>
            The main reason for re-creating the app in a web framework was to
            enable easier implementation as part of larger web applications,
            such as, for eg., a web site which enables the connection of devices
            to database for downloading and uploading data measured by the
            device.<br />
            One further advantage is the creation of progressive web apps is
            assisted by the framework, though it is not presently implemented.
          </p>
          <h3 id="description" class="mb-6">Description</h3>
          <descript />
          <h3 id="usage" class="mb-1">Usage</h3>
          <p>
            Press the "Connect" button at the top right corner. The app searches
            for Bluetooth-LE devices with a name that starts with "ESP32", and
            has a predefined service UUID. Select the desired device from the
            device selection menu, and press "Pair".<br />
            Once paired, the app requests the credentials stored in the device's
            memory.<br />
            Once the device responds, the app populates the SSID and password
            fields from the ESP32 device.<br />
            The app then requests for both a list of SSIDs seen by the device,
            as well as the connection status of the device - whether it is
            connected to the first defined AP, the second, or none of them.<br />
            <i>
              If the device does not support either of the last two functions
              (which happens if the ESP32 is loaded with
              <a
                href="https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/"
              >
                beegee1962's original app
              </a>
              ), these features fail gracefully, and simply outputs a DOM
              exception to the console. </i
            ><br />
            You can then edit the desired fields:<br />
          </p>
          <ul>
            <li>Enter SSID to "Primary defined SSID", or</li>
            <ul>
              <li>
                Select SSID from dropdown, populated from a list as seen by the
                device.
              </li>
            </ul>
            <li>Enter a password matching the SSID selected.</li>
            <ul>
              <li>
                Pressing the Eye icon toggles show / hide of password field.
              </li>
            </ul>
            <li>Enable editing for the secondary password.</li>
            <li>
              If editing of the secondary SSID and password is enabled, you can
              then edit the secondary SSID and password fields in the same
              fashion.
            </li>
            <ul>
              <li>
                <i
                  >Note: If the editing of the secondary SSID credentials is
                  enabled, these fields <u>must not be empty</u>. If editing of
                  those fields is disabled and they are empty, the app will fill
                  them with the Primary's credentials before sending the
                  credentials to the device.</i
                >
              </li>
            </ul>
            <li>
              A status box is displayed above the form fields. In it, the
              current WiFi connection status of the ESP32 device to which the
              app is connected. (If supported by the device).
            </li>
            <li>
              On the right side of the connection status box is a "Refresh"
              button. Pressing this button will ask the device for the
              configuration currently stored on it, and will therefore delete
              any changes you have made
            </li>
            <li>
              <b
                >Any changes will be deleted when disconnected from the device,
                and form fields will not be available for editing</b
              >
            </li>
          </ul>
          <p>
            After defining the crdentials, you can then press the "Configure
            device" button to send the new configuration to the ESP32.<br />
            Two more buttons are also provided: "Erase" - to erase the current
            configured SSIDs and associated passwords, and "Reset" - to reset
            the device when needed.<br />
            Once done with the configuration, click "Disconnect", and the stored
            SSIDs and credentials will be saved in the device's flash memory.
            <br />
            <i>
              Notice: In order to configure WiFi credentials over BLE, an ESP32
              device must be prepared with either of the following beforehand:
            </i>
          </p>
          <ul>
            <li>
              <a href="https://github.com/UriShX/esp32_wifi_ble_advanced">
                This app,
              </a>
              which supports the SSID list and current connection status
              reporting.
            </li>
          </ul>
          or
          <ul>
            <li>
              <a
                href="https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/"
              >
                Beegee1962's app </a
              >, which does not.
            </li>
          </ul>
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
