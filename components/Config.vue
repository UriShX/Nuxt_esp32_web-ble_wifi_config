<template>
  <b-form
    id="myForm"
    method="POST"
    class="row needs-validation"
    novalidate
    @submit.prevent="onSubmit"
  >
    <InputPair
      role="Prim"
      :wifilist="wifiList"
      :enabled="true"
      :validation="validation"
    />
    <!-- <b-row>
      <b-col cols="11">
        <b-form-group
          id="form.ssidPrim-group"
          class="mt-2"
          label-align="left"
          label="Primary defined SSID"
          label-for="form.ssidPrim"
        >
          <b-input-group id="form.ssidPrim" ref="form.ssidPrim">
            <b-form-input
              v-model="form.ssidPrim"
              :disabled="!btStat"
              type="text"
              :state="validation"
              placeholder="Primary SSID"
            ></b-form-input>
            <b-input-group-append class="w-50">
              <b-form-select
                v-model="form.ssidPrim"
                :disabled="!btStat"
                :options="wifiList"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>
                    -- SSID from ESP32 --
                  </b-form-select-option>
                </template>
              </b-form-select>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback :state="validation" align="left">
            Primary SSID cannot be blank!
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
      <b-col cols="11">
        <b-form-group
          id="form.pwPrim-group"
          class="mt-2"
          label="Primary defined SSID's password"
          label-align="left"
          label-for="form.pwPrim"
        >
          <b-input-group id="form.pwPrim" ref="form.pwPrim">
            <b-form-input
              v-model="form.pwPrim"
              type="password"
              :disabled="!btStat"
              :state="validation"
              placeholder="Enter password"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                id="form.pwPrimBtn"
                variant="outline-secondary"
                :disabled="!btStat"
                @click="pwToggle"
              >
                <i id="form.pwPrimEye" class="material-icons material-sm-font">
                  visibility_off
                </i>
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback align="left" :state="validation">
            Password cannot be blank!
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-row> -->
    <b-form-row>
      <b-col cols="11">
        <b-form-row>
          <b-form-checkbox
            id="checkbox-1"
            v-model="secEnabled"
            :disabled="btStat"
            name="checkbox-1"
            class="ml-2"
            switch
          >
            Configure Secondary SSID
          </b-form-checkbox>
        </b-form-row>
        <b-form-group
          id="form.ssidSec-group"
          class="mt-2"
          label-align="left"
          label="Secondary defined SSID"
          label-for="form.ssidSec"
        >
          <b-input-group id="form.ssidSec" ref="form.ssidSec">
            <b-form-input
              v-model="form.ssidSec"
              type="text"
              :state="validation"
              placeholder="Secondary SSID"
              :disabled="!secEnabled || btStat"
            ></b-form-input>
            <b-input-group-append class="w-50">
              <b-form-select
                v-model="form.ssidSec"
                :options="wifiList"
                :disabled="!secEnabled || btStat"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>
                    -- SSID from ESP32 --
                  </b-form-select-option>
                </template>
              </b-form-select>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback :state="validation" align="left">
            Secondary SSID cannot be blank!
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
      <b-col cols="11">
        <b-form-group
          id="form.pwSec-group"
          class="mt-2"
          label="Secondary defined SSID's password"
          label-align="left"
          label-for="form.pwSec"
        >
          <b-input-group id="pwSec" ref="pwSec">
            <b-form-input
              v-model="form.pwSec"
              type="password"
              :state="validation"
              placeholder="Enter password"
              :disabled="!secEnabled || btStat"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                id="pwSecBtn"
                variant="outline-secondary"
                :disabled="!secEnabled || btStat"
                @click="pwToggle"
              >
                <i id="pwSecEye" class="material-icons material-sm-font">
                  visibility_off
                </i>
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback align="left" :state="validation">
            Password cannot be blank!
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>
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
import { mapState } from 'vuex'
import InputPair from '~/components/InputPair'

export default {
  components: {
    InputPair
  },
  data() {
    return {
      form: {
        ssidPrim: null,
        pwPrim: '',
        ssidSec: null,
        pwSec: ''
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
  methods: {
    pwToggle(e) {
      const objToStr = JSON.stringify(e.target.id)
      let pwField

      // eslint-disable-next-line
      console.log(objToStr)

      if (objToStr.includes('pwPrim')) {
        pwField = this.$refs.pwPrim
      } else {
        pwField = this.$refs.pwSec
      }

      // eslint-disable-next-line
      console.log(pwField)

      if (pwField.querySelector('input').type === 'password') {
        pwField.querySelector('input').type = 'text'
        pwField.querySelector('i').textContent = 'visibility'
      } else {
        pwField.querySelector('input').type = 'password'
        pwField.querySelector('i').textContent = 'visibility_off'
      }
    },
    eraseSSIDs() {},
    resetSSIDs(evt) {
      evt.preventDefault()
    },
    onSubmit(evt) {
      // eslint-disable-next-line
      console.log(evt)
      evt.preventDefault()
      // eslint-disable-next-line
      console.log(this.form)

      alert(JSON.stringify(this.form))
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.name = ''
      this.form.food = null
      this.form.checked = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
