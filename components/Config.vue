<template>
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
      apName: (state) => state.APName
    })
  },
  watch: {
    btStat(newVal, oldVal) {
      if (newVal === true) {
        this.recieveCredentials()
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
      this.recieveWifiList()
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

      await this.$espconfig
        .readCredentials()
        .then((value) => {
          jsonRecieved = jsonEncodeDecode(this.apName, value)
          jsonRecieved = decoder.decode(jsonRecieved)
          this.$store.dispatch('setForm', jsonRecieved)
        })
        .then(this.recieveWifiList())
      // .then(() => {
      //   if (this.$espconfig.connectionStatusUuid) {
      //     // this.$espconfig.startConnectionstatusNotifications(statusUpdate)
      //   }
      // })
    },
    async recieveWifiList() {
      if (this.$espconfig.ssidListUuid) {
        const decoder = new TextDecoder('windows-1252')
        this.dropdownMessage = 'Updating SSIDs from device...'
        await this.$espconfig.readSsidlist().then((value) => {
          if (value) {
            this.dropdownMessage = 'SSID seen by device'
            value = decoder.decode(value)
            value = JSON.parse(value)
            this.wifiList = value.SSID
            return value
          } else this.dropdownMessage = '-- SSID from ESP32 --'
        })
      }
    }
  }
}
</script>
