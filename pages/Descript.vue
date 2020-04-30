<template>
  <div id="description-text" class="row">
    <div class="col mb-6">
      <h3 class="mb-6">Description</h3>
      <p>
        A web-ble implementation of Bernd Giesecke's
        <a
          href="https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/"
          >ESP32 WiFi configuration over BLE</a
        >. Bernd's control app is Android only, while web-ble is being developed
        as a web standard, and is available currently (02/2020) on Chrome for
        OSX, Windows 10, and Android (<a
          href="https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md"
          >click here for current implementation status</a
        >).
      </p>
      <p>
        The repository for this app is hosted on github
        <a href="https://github.com/UriShX/esp32_web-ble_wifi_config">here</a>.
      </p>
      <h3 class="mb-1">Usage</h3>
      <p>
        Press the "Connect" button at the top right corner. The app searches for
        BLE devices with a name that starts with "ESP32", and has a predefined
        service UUID. Select the desired device from the device selection menu,
        and press "Pair". Once paired, the app requests the credentials stored
        in the device's memory. Once recieved, the app populates the SSID and
        password fields from the data recieved from the ESP32 device. You can
        then edit the desired fields, and then press the "Configure device"
        button to send the new configuration to the ESP32. Two more buttons are
        also provided: "Erase" - to erase the current configured SSIDs and
        associated passwords, and "Reset" - to reset the device when needed.
        Once done with the configuration, click "Disconnect", and the stored
        SSIDs and credentials will be saved in the device's flash memory.
        <br />
        <i
          >Notice: In order to configure WiFi credentials over BLE, an ESP32
          device must be prepared with
          <a
            href="https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/"
            >beegee1962's app</a
          >
          beforehand.</i
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return { title: 'About: ESP32 configuration tool built w/ Nuxt.js' }
  }
}
</script>
