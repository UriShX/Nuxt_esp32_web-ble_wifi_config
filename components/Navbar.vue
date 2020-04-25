<template>
  <b-navbar toggleable class="navbar-expand-sm" type="dark" variant="dark">
    <b-navbar-brand href="#">Navigate:</b-navbar-brand>

    <b-navbar-toggle target="navbar-toggle-collapse" />

    <b-collapse id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="ml-md-2">
        <b-nav-item href="#config">WiFi config</b-nav-item>
        <b-nav-item href="#descript">About</b-nav-item>
      </b-navbar-nav>
      <b-button
        id="ble_connect"
        variant="info"
        class="ml-auto"
        @click="btConnect"
      >
        <span id="connect_text">Connect </span>
        <i id="connection_status" class="material-icons material-sm-font">{{
          btIcon
        }}</i>
      </b-button>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      btStat: false,
      btIcon: 'bluetooth'
    }
  },
  methods: {
    btConnect() {
      if (!this.btStat) {
        this.btIcon = 'bluetooth_connected'
      } else {
        this.btIcon = 'bluetooth'
      }

      this.btStat = !this.btStat
    }
  }
}
</script>

<style scoped>
.material-sm-font {
  font-size: 1em;
}
</style>
