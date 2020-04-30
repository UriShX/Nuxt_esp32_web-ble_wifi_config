<template>
  <div>
    <div id="testingGroundDiv" class="row">
      <b-form
        id="myForm"
        method="POST"
        class="needs-validation"
        novalidate
        data-bind="submit: passData"
      >
        <b-row>
          <b-col cols="11">
            <b-form-group
              id="ssidPrim-group"
              class="mt-2"
              label-align="left"
              label="Primary defined SSID"
              label-for="ssidPrim"
            >
              <b-input-group id="ssidPrim" ref="ssidPrim">
                <b-form-input
                  v-model="ssidPrim"
                  :disabled="!btStat"
                  type="text"
                  :state="validation"
                  placeholder="Primary SSID"
                ></b-form-input>
                <b-input-group-append class="w-50">
                  <b-form-select
                    v-model="ssidPrim"
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
              id="pwPrim-group"
              class="mt-2"
              label="Primary defined SSID's password"
              label-align="left"
              label-for="pwPrim"
            >
              <b-input-group id="pwPrim" ref="pwPrim">
                <b-form-input
                  v-model="pwPrim"
                  type="password"
                  :disabled="!btStat"
                  :state="validation"
                  placeholder="Enter password"
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    id="pwPrimBtn"
                    variant="outline-secondary"
                    :disabled="!btStat"
                    @click="pwToggle"
                  >
                    <i id="pwPrimEye" class="material-icons material-sm-font">
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
        </b-row>
        <b-row>
          <b-col cols="11">
            <b-form-row>
              <b-form-checkbox
                id="checkbox-1"
                v-model="enabled.sec"
                name="checkbox-1"
                class="ml-2"
                switch
              >
                Configure Secondary SSID
              </b-form-checkbox>
            </b-form-row>
            <b-form-group
              id="ssidSec-group"
              class="mt-2"
              label-align="left"
              label="Secondary defined SSID"
              label-for="ssidSec"
            >
              <b-input-group id="ssidSec" ref="ssidSec">
                <b-form-input
                  v-model="ssidSec"
                  type="text"
                  :state="validation"
                  placeholder="Secondary SSID"
                  :disabled="!enabled.sec"
                ></b-form-input>
                <b-input-group-append class="w-50">
                  <b-form-select
                    v-model="ssidSec"
                    :options="wifiList"
                    :disabled="!enabled.sec"
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
              id="pwSec-group"
              class="mt-2"
              label="Secondary defined SSID's password"
              label-align="left"
              label-for="pwSec"
            >
              <b-input-group id="pwSec" ref="pwSec">
                <b-form-input
                  v-model="pwSec"
                  type="password"
                  :state="validation"
                  placeholder="Enter password"
                  :disabled="!enabled.sec"
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    id="pwSecBtn"
                    variant="outline-secondary"
                    :disabled="!enabled.sec"
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
        </b-row>
        <div id="configButtons">
          <b-button id="setSSIDs" type="submit" variant="primary">
            Configure device
          </b-button>
          <b-button id="eraseSSIDs" variant="secondary" @click="eraseSSIDs">
            Erase
          </b-button>
          <b-button id="resetSSIDs" variant="secondary" @click="resetSSIDs">
            Reset
          </b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      ssidPrim: null,
      pwPrim: '',
      ssidSec: null,
      pwSec: '',
      wifiList: ['abc', 'Kuki'],
      enabled: { prim: true, sec: false }
    }
  },
  computed: {
    validation() {
      return this.pwPrim.length > 4 && this.pwPrim.length < 13
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
    resetSSIDs() {}
  }
}
</script>

<style scoped>
.material-sm-font {
  font-size: 1em;
}
</style>
