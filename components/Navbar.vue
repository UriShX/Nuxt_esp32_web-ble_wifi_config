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
        <b-nav-item to="descript">About</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-button
      id="ble_connect"
      variant="info"
      class="ml-auto"
      :disabled="!btAvailable"
      @click="btConnect"
    >
      <span id="connect_text">Connect </span>
      <i id="connection_status" class="material-icons material-sm-font">{{
        btIcon
      }}</i>
    </b-button>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'
import Espconfig from '~/assets/espconfig'

export default {
  data() {
    return {
      // btStat: connected,
      btIcon: 'bluetooth',
      espconfig: new Espconfig(),
      btAvailable: null
    }
  },
  computed: {
    ...mapState({
      btStat: (state) => state.connected
    })
  },
  async created() {
    this.btAvailable = await navigator.bluetooth.getAvailability()

    if (this.btAvailable) {
      this.espconfig.setSsidListUuid('1d338124-7ddc-449e-afc7-67f8673a1160') // SSID list characteristic. Read only.
      this.espconfig.setConnectionStatusUuid(
        '5b3595c4-ad4f-4e1e-954e-3b290cc02eb0'
      ) // Notification, wifi connection status UUID
    } else {
      this.btIcon = 'bluetooth_disabled'
    }
  },
  methods: {
    async btConnect() {
      if (!this.btStat) {
        this.btIcon = 'bluetooth_searching'
        // Request the device for connection and get its name after successful connection.
        await this.espconfig
          .request()
          .then((_) => this.espconfig.connect())
          .then((_) => {
            this.espconfig.recieveCredentials()
            this.btStat = !this.btStat
            this.btIcon = 'bluetooth_connected'
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error)
            this.btIcon = 'bluetooth'
          })
      } else {
        // Disconnect from the connected device.
        await this.espconfig.disconnect()
        this.btStat = !this.btStat
        this.btIcon = 'bluetooth'
      }
    }
  }
}
</script>

<style scoped>
.material-sm-font {
  font-size: 1em;
}
</style>
