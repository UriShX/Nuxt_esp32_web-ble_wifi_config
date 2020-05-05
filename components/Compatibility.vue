<template>
  <div ref="compatDiv">
    <b-alert show variant="danger" :hidden="alertSwitch">
      This site relies heavily on JavaScript. To enable this site to function
      properly you must have it enabled.
    </b-alert>
    <b-alert show variant="warning" :hidden="btAvailable">
      <!-- <span v-html="availabiltyMessage"></span> -->
      <p v-for="message in availabiltyMessage" :key="message">
        {{ message }}
      </p>
      <p>
        Please check implementation status at:
        <a
          href="https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md"
        >
          this
        </a>
        github repo
      </p>
    </b-alert>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import navigatorCheck from '~/assets/navigatorCheck'

export default {
  data() {
    return {
      alertSwitch: null,
      environmentVars: null,
      availabiltyMessage: []
    }
  },
  computed: {
    ...mapState({
      btAvailable: (state) => state.available
    })
  },
  created() {
    // If JS loads, hide JS missing alert
    this.alertSwitch = true
  },
  mounted() {
    this.environmentVars = navigatorCheck()

    if (!this.btAvailable) {
      if (this.environmentVars.os === '') {
        this.availabiltyMessage.push(
          'Your OS does not yet provide support for the web-bluetooth protocolYour OS.'
        )
      } else {
        this.availabiltyMessage.push(
          `You are using a ${this.environmentVars.nav} based browser on a ${this.environmentVars.os} OS.`
        )
      }
      if (this.environmentVars.nav === 'Chromium') {
        this.availabiltyMessage.push(
          'You may be seeing this message since web-bluetooth is not enabled in your system.'
        )
      } else {
        this.availabiltyMessage.push(
          'The browser you are using does not yet provide support for the web-bluetooth protocol.'
        )
      }
    }
  }
}
</script>
