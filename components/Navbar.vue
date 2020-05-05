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
      this.$espconfig.setSsidListUuid('1d338124-7ddc-449e-afc7-67f8673a1160') // SSID list characteristic. Read only.
      this.$espconfig.setConnectionStatusUuid(
        '5b3595c4-ad4f-4e1e-954e-3b290cc02eb0'
      ) // Notification, wifi connection status UUID
    },
    async btConnect() {
      if (!this.btStat) {
        this.btnHandler('searching')
        // Request the device for connection and get its name after successful connection.
        await this.$espconfig
          .request()
          .then((_) => this.$espconfig.connect())
          .then((_) => {
            // this.$espconfig.recieveCredentials()
            // this.btStat = !this.btStat
            this.$store.dispatch('switchConnection', !this.btStat)
            this.btnHandler('disconnect')
          })
          .then((_) => {
            const APName = this.$espconfig.device.name
            this.$store.dispatch('setApName', APName)
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error)
            this.btnHandler('connect')
          })
      } else {
        // Disconnect from the connected device.
        await this.$espconfig.disconnect()
        // this.btStat = !this.btStat
        this.$store.dispatch('switchConnection', !this.btStat)
        this.btnHandler('connect')
        this.$store.dispatch('setApName', '')
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
