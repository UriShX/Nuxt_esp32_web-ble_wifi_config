<template>
  <div>
    <config />
  </div>
</template>

<script>
import Config from '~/components/Config'
export default {
  components: {
    Config
  },
  head() {
    return {
      title: 'Configuration Form: ESP32 WiFi config tool built w/ Nuxt.js'
    }
  }
}
</script>
