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
            :id="ssidId"
            v-model="ssid"
            :disabled="!enabled"
            type="text"
            placeholder="SSID"
            @blur="passByRef"
          ></b-form-input>
          <b-input-group-append class="w-50">
            <b-form-select
              :id="ssidId + '-select'"
              v-model="ssid"
              :disabled="!enabled"
              :options="wifilist"
              @change="passByRef"
            >
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>
                  {{ dropdownMessage }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-input-group-append>
        </b-input-group>
        <div :hidden="!enabled">
          <b-form-invalid-feedback :state="validate.ssid" align="left">
            SSID cannot be blank!
          </b-form-invalid-feedback>
        </div>
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
            :id="pwId"
            v-model="pw"
            type="password"
            :disabled="!enabled"
            placeholder="Enter password"
            @blur="passByRef"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              :id="pwId + 'Btn'"
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
        <div :hidden="!enabled">
          <b-form-invalid-feedback align="left" :state="validate.pw">
            Password cannot be blank!
          </b-form-invalid-feedback>
        </div>
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
    dropdownMessage: {
      type: String,
      default: '-- SSID from ESP32 --'
    },
    enabled: {
      type: Boolean,
      required: true
    },
    validate: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ssid: null,
      pw: null,
      ssidId: `ssid${this.role}`,
      pwId: `pw${this.role}`,
      ssidLabel: this.role + '. defined SSID:',
      pwLabel: this.role + ". defined SSID's password:"
    }
  },
  computed: {
    ssidGetter() {
      return this.$store.getters[`get${this.role}Ssid`]
    },
    pwGetter() {
      return this.$store.getters[`get${this.role}Pw`]
    }
  },
  watch: {
    ssidGetter(newSsid, oldSsid) {
      if (newSsid !== this.ssid) {
        this.ssid = newSsid
      }
    },
    pwGetter(newPw, oldPw) {
      if (newPw !== this.pw) {
        this.pw = newPw
      }
    }
  },
  mounted() {
    const storeSsid = this.ssidGetter
    const storePw = this.pwGetter

    if (storeSsid !== this.ssid) {
      this.ssid = storeSsid
    }

    if (storePw !== this.pw) {
      this.pw = storePw
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
      // Updating fields directly in store
      // A bit of a brute force approach, but better then eval()

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

      // this.$parent.getJsonFromChild(
      this.$store.dispatch(
        'setForm',
        `{"${fieldName}${this.role}":"${
          fieldRef.querySelector('input').value
        }"}`
      )
    }
  }
}
</script>
