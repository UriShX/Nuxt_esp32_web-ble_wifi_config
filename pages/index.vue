<template>
  <div>
    <b-row>
      <b-alert
        :show="dismissCountDown"
        dismissible
        style="width:90%"
        @dismissed="dismissCountDown = 0"
        @dismiss-count-down="countDownChanged"
      >
        <descript />
        <p>
          A sample application and a more in-depth description can be found in
          the
          <nuxt-link to="about">About</nuxt-link> page.
        </p>
        <p>This alert will dismiss after {{ dismissCountDown }} seconds...</p>
        <b-progress
          variant="alert"
          :max="dismissSecs"
          :value="dismissCountDown"
          height="4px"
        ></b-progress>
      </b-alert>
    </b-row>
    <config />
  </div>
</template>

<script>
import Descript from '~/components/Description'
import Config from '~/components/Config'

export default {
  components: {
    Descript,
    Config
  },
  data() {
    return {
      dismissSecs: 60,
      dismissCountDown: 60
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    }
  }
}
</script>
