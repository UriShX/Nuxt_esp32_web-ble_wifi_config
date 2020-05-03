<template>
  <b-row>
    <b-col cols="11">
      <b-form-group
        id="ssid-group"
        class="mt-2"
        label-align="left"
        :label="ssidLabel"
        label-for="ssid"
      >
        <b-input-group ref="ssid">
          <b-form-input
            id="ssid"
            v-model="ssid"
            :disabled="!enabled"
            type="text"
            placeholder="SSID"
            @blur="passByRef"
          ></b-form-input>
          <b-input-group-append class="w-50">
            <b-form-select
              id="ssid-select"
              v-model="ssid"
              :disabled="!enabled"
              :options="wifilist"
              @change="passByRef"
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
        id="pw-group"
        class="mt-2"
        :label="pwLabel"
        label-align="left"
        label-for="pw"
      >
        <b-input-group ref="pw">
          <b-form-input
            id="pw"
            v-model="pw"
            type="password"
            :disabled="!enabled"
            placeholder="Enter password"
            @blur="passByRef"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              id="pwBtn"
              variant="outline-secondary"
              :disabled="!enabled"
              @click="pwToggle"
            >
              <i id="pwEye" class="material-icons material-sm-font">
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
</template>

<script>
export default {
  props: {
    role: {
      type: String,
      required: true
    },
    wifilist: {
      type: Array,
      required: true
    },
    enabled: {
      type: Boolean,
      required: true
    },
    validation: Boolean
  },
  data() {
    return {
      ssid: null,
      pw: '',
      ssidLabel: this.role + '. defined SSID:',
      pwLabel: this.role + ". defined SSID's password:"
    }
  },
  methods: {
    pwToggle() {
      const pwField = this.$refs.pw

      if (pwField.querySelector('input').type === 'password') {
        pwField.querySelector('input').type = 'text'
        pwField.querySelector('i').textContent = 'visibility'
      } else {
        pwField.querySelector('input').type = 'password'
        pwField.querySelector('i').textContent = 'visibility_off'
      }
    },

    passByRef(e) {
      // Works but with eval. Not a good solution.

      let fieldName
      let fieldRef

      // Try Catch used because select event is equal to content selected
      try {
        JSON.stringify(e.target.id)
      } catch (error) {
        fieldName = 'ssid'
      }

      if (
        fieldName !== undefined ||
        JSON.stringify(e.target.id).includes('ssid')
      ) {
        fieldName = 'ssid'
        fieldRef = this.$refs.ssid
      } else {
        fieldName = 'pw'
        fieldRef = this.$refs.pw
      }

      // eslint-disable-next-line
      eval(
        `this.$parent.form.${fieldName}${this.role} = "${
          fieldRef.querySelector('input').value
        }"`
      )
    }
  }
}
</script>
