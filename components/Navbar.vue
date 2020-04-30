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

export default {
  data() {
    return {
      btIcon: 'bluetooth'
      // btAvailable: null
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
    }
  },
  methods: {
    async btConnect() {
      if (!this.btStat) {
        this.btIcon = 'bluetooth_searching'
        // Request the device for connection and get its name after successful connection.
        await this.$espconfig
          .request()
          .then((_) => this.$espconfig.connect())
          .then((_) => {
            // this.$espconfig.recieveCredentials()
            // this.btStat = !this.btStat
            this.$store.dispatch('switchConnection', !this.btStat)
            this.btIcon = 'bluetooth_connected'
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error)
            this.btIcon = 'bluetooth'
          })
      } else {
        // Disconnect from the connected device.
        await this.$espconfig.disconnect()
        // this.btStat = !this.btStat
        this.$store.dispatch('switchConnection', !this.btStat)
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
