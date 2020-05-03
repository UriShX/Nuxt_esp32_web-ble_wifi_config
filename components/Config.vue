<template>
  <b-form
    id="my-form"
    method="POST"
    class="row needs-validation"
    novalidate
    @submit.prevent="onSubmit"
  >
    <InputPair
      role="Prim"
      :wifilist="wifiList"
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
      role="Sec"
      :wifilist="wifiList"
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
      <b-button id="resetSSIDs" variant="secondary" @click="resetSSIDs">
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
      secEnabled: false
    }
  },
  computed: {
    validation() {
      return this.form.pwPrim.length > 4 && this.form.pwPrim.length < 13
    },
    ...mapState({
      btStat: (state) => state.connected
    })
  },
  validations: {
    form: {
      ssidPrim: {
        required
      },
      pwPrim: {
        required
        // between: between(4, 32)
      },
      ssidSec: {
        required
      },
      pwSec: {
        required
        // between: between(4, 32)
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    eraseSSIDs() {},
    resetSSIDs(evt) {
      evt.preventDefault()
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
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.ssidPrim = ''
      this.form.pwPrim = ''
      this.form.ssidSec = ''
      this.form.pwSec = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
