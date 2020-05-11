<template>
  <div>
    <b-row align-h="start">
      <b-col col cols="11">
        <b-alert show variant="info">
          <b-row>
            <b-col>
              <span v-if="!btStat">
                Waiting for connection...
              </span>
              <span v-else>
                {{ connectionStatus }}
              </span>
            </b-col>
            <b-col col cols="1">
              <b-link :hidden="!btStat" @click="recieveCredentials">
                <i class="material-icons material-sm-font">
                  refresh
                </i>
              </b-link>
            </b-col>
          </b-row>
        </b-alert>
      </b-col>
    </b-row>
    <b-form
      id="my-form"
      method="POST"
      class="row needs-validation"
      novalidate
      @submit.prevent="onSubmit"
      @reset.prevent="onReset"
    >
      <InputPair
        ref="Prim"
        role="Prim"
        :wifilist="wifiList"
        :dropdown-message="dropdownMessage"
        :enabled="btStat"
        :validate="{
          ssid: validateState('ssidPrim'),
          pw: validateState('pwPrim')
        }"
      />

      <b-form-row>
        <b-form-checkbox
          id="checkbox-1"
          v-model="secEnabled"
          :disabled="!btStat"
          name="checkbox-1"
          class="ml-2"
          switch
        >
          Configure Secondary SSID
        </b-form-checkbox>
      </b-form-row>
      <InputPair
        ref="Sec"
        role="Sec"
        :wifilist="wifiList"
        :dropdown-message="dropdownMessage"
        :enabled="secEnabled && btStat"
        :validate="{
          ssid: validateState('ssidSec'),
          pw: validateState('pwSec')
        }"
      />

      <b-col cols="11">
        <b-button
          id="setSSIDs"
          type="submit"
          variant="primary"
          :disabled="!btStat"
        >
          Configure device
        </b-button>
        <b-button
          id="eraseSSIDs"
          variant="secondary"
          :disabled="!btStat"
          @click="eraseSSIDs"
        >
          Erase
        </b-button>
        <b-button
          id="resetSSIDs"
          type="reset"
          variant="secondary"
          :disabled="!btStat"
        >
          Reset
        </b-button>
      </b-col>
    </b-form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
import InputPair from '~/components/InputPair'
import { jsonEncodeDecode, jsonAssemble } from '~/assets/string_helpers'

export default {
  components: {
    InputPair
  },
  mixins: [validationMixin],
  data() {
    return {
      connectionStatus: 'Device is not connected',
      wifiList: [],
      dropdownMessage: '-- SSID from ESP32 --',
      secEnabled: false
    }
  },
  computed: {
    form() {
      return this.$store.getters.getForm
    },
    ...mapState({
      btStat: (state) => state.connected,
      apName: (state) => state.APName,
      esp32connected: (state) => state.apStatus,
      storedOnDevice: (state) => state.onDevice
    })
  },
  watch: {
    esp32connected(newVal, oldVal) {
      this.notificationHandler()
    },
    btStat(newVal, oldVal) {
      if (newVal === true) {
        this.recieveCredentials()
        this.notificationHandler()
      } else {
        this.dropdownMessage = '-- SSID from ESP32 --'
        this.$store.dispatch(
          'setForm',
          JSON.stringify({
            ssidPrim: null,
            pwPrim: null,
            ssidSec: null,
            pwSec: null
          })
        )
        this.$store.dispatch(
          'setOnDevice',
          JSON.stringify({
            ssidPrim: null,
            ssidSec: null
          })
        )
        this.$store.dispatch('setApStatus', -1)
      }
    }
  },
  validations: {
    form: {
      ssidPrim: {
        required
      },
      pwPrim: {
        required
      },
      ssidSec: {
        required
      },
      pwSec: {
        required
      }
    }
  },
  mounted() {
    if (this.btStat) {
      if (!this.form.ssidPrim) this.recieveCredentials()
      this.recieveWifiList()
      this.notificationHandler()
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    eraseSSIDs() {
      this.$espconfig.writeCredentials(jsonAssemble(this.apName, { erase: '' }))

      this.recieveCredentials()
    },
    onSubmit(evt) {
      if (!this.form.ssidSec && !this.form.pwSec && !this.secEnabled) {
        this.$store.dispatch(
          'setForm',
          `{"ssidSec":"${this.form.ssidPrim}","pwSec":"${this.form.pwPrim}"}`
        )
        this.validateState('ssidSec')
        this.validateState('pwSec')
      }

      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }

      this.$espconfig.writeCredentials(jsonAssemble(this.apName, this.form))

      this.recieveCredentials()
    },
    onReset() {
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })

      this.$espconfig.writeCredentials(jsonAssemble(this.apName, { reset: '' }))
    },
    async recieveCredentials() {
      // Recieve int8Array from ESP32 utility, then XOR with device name.
      // Finally decode as ASCII text, and parse as JSON
      let jsonRecieved
      const decoder = new TextDecoder('windows-1252')

      const value = await this.$espconfig.readCredentials()

      jsonRecieved = jsonEncodeDecode(this.apName, value)
      jsonRecieved = decoder.decode(jsonRecieved)
      this.$store.dispatch('setForm', jsonRecieved)
      this.$store.dispatch('setOnDevice', jsonRecieved)

      await this.recieveWifiList()

      if (this.$espconfig.connectionStatusUuid) {
        await this.$espconfig.startConnectionstatusNotifications((event) => {
          this.$store.dispatch('setApStatus', event.target.value.getUint8())
        })
      }
    },
    async recieveWifiList() {
      if (this.$espconfig.ssidListUuid) {
        const decoder = new TextDecoder('windows-1252')
        this.dropdownMessage = 'Updating SSIDs from device...'

        let value = await this.$espconfig.readSsidlist()
        // eslint-disable-next-line
        console.log(value)
        if (value) {
          this.dropdownMessage = 'SSID seen by device'
          value = decoder.decode(value)
          // eslint-disable-next-line
          console.log(value)

          value = JSON.parse(value)
          // eslint-disable-next-line
          console.log(value)

          this.wifiList = value.SSID
          return value
        } else this.dropdownMessage = '-- SSID from ESP32 --'
      }
    },
    notificationHandler() {
      if (this.esp32connected === -1)
        this.connectionStatus =
          'Your device does not support connection status reporting'
      else if (this.esp32connected === 0)
        this.connectionStatus = 'ESP32 is not connected to WiFi AP'
      else if (!this.storedOnDevice.ssidPrim && !this.storedOnDevice.ssidSec) {
        setTimeout(() => {
          this.notificationHandler()
        }, 250)
      } else if (this.esp32connected === 1)
        this.connectionStatus = `ESP32 connected to ${this.storedOnDevice.ssidPrim}`
      else if (this.esp32connected === 2)
        this.connectionStatus = `ESP32 connected to ${this.storedOnDevice.ssidSec}`
    }
  }
}
</script>
