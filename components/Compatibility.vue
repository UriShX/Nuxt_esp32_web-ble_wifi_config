<template>
  <div ref="compatDiv">
    <b-alert show variant="danger" :hidden="alertSwitch">
      This site relies heavily on JavaScript. To enable this site to function
      properly you must have it enabled.
    </b-alert>
    <b-alert show variant="warning" :hidden="btAvailable">
      <span v-html="availabiltyMessage"></span>
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
      availabiltyMessage: ''
    }
  },
  computed: {
    ...mapState({
      btAvailable: (state) => state.available
    })
  },
  created() {
    this.alertSwitch = true
  },
  mounted() {
    this.availabiltyMessage = navigatorCheck()

    if (this.btAvailable) {
      this.$espconfig.setSsidListUuid('1d338124-7ddc-449e-afc7-67f8673a1160') // SSID list characteristic. Read only.
      this.$espconfig.setConnectionStatusUuid(
        '5b3595c4-ad4f-4e1e-954e-3b290cc02eb0'
      ) // Notification, wifi connection status UUID
    } else {
      this.availabiltyMessage =
        '<p>' + this.availabiltyMessage + '</p>' + '<p> Lorem Ipsum </p>'
    }
  }
}
</script>
