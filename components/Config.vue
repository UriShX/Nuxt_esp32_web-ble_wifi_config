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
      <b-button id="setSSIDs" type="submit" variant="primary">
        Configure device
      </b-button>
      <b-button id="eraseSSIDs" variant="secondary" @click="eraseSSIDs">
        Erase
      </b-button>
      <b-button
        id="resetSSIDs"
        type="reset"
        variant="secondary"
        @click="eraseSSIDs"
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
import { jsonEncodeDecode } from '~/assets/string_helpers'

export default {
  components: {
    InputPair
  },
  mixins: [validationMixin],
  data() {
    return {
      form: {
        ssidPrim: null,
        pwPrim: null,
        ssidSec: null,
        pwSec: null
      },
      wifiList: ['abc', 'Kuki'],
      dropdownMessage: '-- SSID from ESP32 --',
      secEnabled: false
    }
  },
  computed: {
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
        this.form.ssidPrim = null
        this.form.pwPrim = null
        this.form.ssidSec = null
        this.form.pwSec = null
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
  methods: {
    getJsonFromChild(formElement) {
      const formObject = JSON.parse(formElement)
      if (
        Object.prototype.hasOwnProperty.call(this.form, Object.keys(formObject))
      ) {
        Object.defineProperty(this.form, Object.keys(formObject), {
          value: Object.values(formObject)[0]
        })
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    eraseSSIDs() {
      // Reset our form values
      this.form.ssidPrim = ''
      this.form.pwPrim = ''
      this.form.ssidSec = ''
      this.form.pwSec = ''

      try {
        this.$refs.Prim.ssid = null
        this.$refs.Prim.pw = null
        this.$refs.Sec.ssid = null
        this.$refs.Sec = null
      } catch (error) {
        alert(error)
      }
    },
    onSubmit(evt) {
      if (!this.form.ssidSec && !this.form.pwSec && !this.secEnabled) {
        this.form.ssidSec = this.form.ssidPrim
        this.validateState('ssidSec')
        this.form.pwSec = this.form.pwPrim
        this.validateState('pwSec')
      }

      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }

      alert(JSON.stringify(this.form))
    },
    onReset() {
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    // Recieve int8Array from ESP32 utility, then XOR with device name.
    // Finally decode as ASCII text, and parse as JSON
    async recieveCredentials() {
      let jsonRecieved
      // let jsonStringToSend
      // alert(data);
      const decoder = new TextDecoder('windows-1252')

      await this.$espconfig
        .readCredentials()
        .then((value) => {
          // eslint-disable-next-line
          console.log(value)
          // console.log(decoder.decode(value));

          jsonRecieved = jsonEncodeDecode(this.apName, value)
          jsonRecieved = decoder.decode(jsonRecieved)
          // console.log(jsonRecieved); // debug
          jsonRecieved = JSON.parse(jsonRecieved)
          // console.log(jsonRecieved);  // debug
          return jsonRecieved
        })
        .then((jsonRecieved) => {
          // Update fields (knockout observables)
          this.form.ssidPrim = jsonRecieved.ssidPrim
          this.form.pwPrim = jsonRecieved.pwPrim
          this.form.ssidSec = jsonRecieved.ssidSec
          this.form.pwSec = jsonRecieved.pwSec
        })
        .then(() => {
          if (this.$espconfig.ssidListUuid) {
            this.dropdownMessage = 'Updating SSIDs from device...'
            this.$espconfig.readSsidlist().then((value) => {
              if (value) {
                this.dropdownMessage = 'SSID seen by device'
                value = decoder.decode(value)
                value = JSON.parse(value)
                this.wifiList = value.SSID
                // console.log(value);
                return value
              } else this.dropdownMessage = '-- SSID from ESP32 --'
            })
          }
        })
      // .then(() => {
      //   if (this.$espconfig.connectionStatusUuid) {
      //     // this.$espconfig.startConnectionstatusNotifications(statusUpdate)
      //   }
      // })
    }
  }
}
</script>
