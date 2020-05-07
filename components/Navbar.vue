<template>
  <b-navbar
    sticky
    toggleable
    class="navbar-expand-sm"
    type="dark"
    variant="dark"
  >
    <b-navbar-brand to="/">Navigate:</b-navbar-brand>
    <b-navbar-toggle target="navbar-toggle-collapse" />

    <b-collapse id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="ml-md-2">
        <b-nav-item to="config">WiFi config</b-nav-item>
        <b-nav-item to="about">About</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-button
      id="ble_connect"
      variant="info"
      class="ml-auto"
      :disabled="!btAvailable"
      @click="btConnect"
    >
      <span id="connect_text">
        {{ btBtnText }}
      </span>
      <i id="connection_status" class="material-icons material-sm-font">
        {{ btIcon }}
      </i>
    </b-button>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      btIcon: 'bluetooth',
      btBtnText: 'Connect '
    }
  },
  computed: {
    ...mapState({
      btStat: (state) => state.connected,
      btAvailable: (state) => state.available
    })
  },
  async mounted() {
    this.btCurr = await this.$espconfig.getAvailability()
    this.$store.dispatch('switchAvailability', this.btCurr)

    if (!this.btAvailable) {
      this.btIcon = 'bluetooth_disabled'
    } else {
      this.setEspConfig()
    }
  },
  methods: {
    setEspConfig() {
      /** Change these variables to match your device
       *  The name prefix, service uuid & credentials uuid are those set as default in
       *  ~/assets/espconfig.js, to match those set in Bernd Giesecke's ESP32 Arduino sketch
       *  found here: https://desire.giesecke.tk/index.php/2018/04/06/esp32-wifi-setup-over-ble/
       *
       *  Those defaults also match my later implementation. Ontop of that, my sketch adds ssid
       *  scan list and connection status, which are not set as default in ~/assets/espconfig.js,
       *  and are therefor added here.
       */
      // this.$espconfig.setNamePrefix('ESP32')
      // this.$espconfig.setServiceUuid('0000aaaa-ead2-11e7-80c1-9a214cf093ae')
      // this.$espconfig.setCredentialsUuid('00005555-ead2-11e7-80c1-9a214cf093ae')
      this.$espconfig.setSsidListUuid('1d338124-7ddc-449e-afc7-67f8673a1160') // SSID list characteristic. Read only.
      this.$espconfig.setConnectionStatusUuid(
        '5b3595c4-ad4f-4e1e-954e-3b290cc02eb0'
      ) // Notification, wifi connection status UUID

      /** The following two functions handle connect and disconnect events */
      this.$espconfig.setOnConnected(() => {
        this.$store.dispatch('switchConnection', true)
        this.btnHandler('disconnect')
        this.$store.dispatch('setApName', this.$espconfig.device.name)
      })
      this.$espconfig.setOnDisconnected(() => {
        this.$store.dispatch('switchConnection', false)
        this.btnHandler('connect')
        this.$store.dispatch('setApName', '')
      })
    },
    async btConnect() {
      if (!this.btStat) {
        this.btnHandler('searching')
        // Request the device for connection and get its name after successful connection.
        await this.$espconfig
          .request()
          .then((_) => this.$espconfig.connect())
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error)
            this.btnHandler('connect')
          })
      } else {
        // Disconnect from the connected device.
        await this.$espconfig.disconnect()
      }
    },
    btnHandler(status) {
      switch (status) {
        case 'connect':
          this.btBtnText = 'Connect '
          this.btIcon = 'bluetooth'
          break
        case 'disconnect':
          this.btBtnText = 'Disconnect '
          this.btIcon = 'bluetooth_connected'
          break
        case 'searching':
          this.btBtnText = 'Connecting... '
          this.btIcon = 'bluetooth_searching'
          break
      }
    }
  }
}
</script>
