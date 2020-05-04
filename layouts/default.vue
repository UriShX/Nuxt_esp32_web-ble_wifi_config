<template>
  <div>
    <navbar />
    <b-container fluid="sm">
      <div class="mt-2">
        <compatibility />
      </div>
      <div class="ml-3">
        <b-row>
          <h1 class="mb-3">
            ESP32 WiFi config
          </h1>
        </b-row>

        <nuxt />
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import Compatibility from '~/components/Compatibility'

export default {
  components: {
    Navbar,
    Compatibility
  }
}
</script>

<style>
.material-sm-font {
  font-size: 1em;
}

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.container {
  margin: 10px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
