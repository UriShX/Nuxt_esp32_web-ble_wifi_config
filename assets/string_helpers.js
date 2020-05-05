// // Recieve int8Array from ESP32 utility, then XOR with device name.
// // Finally decode as ASCII text, and parse as JSON
// export function recieveCredentials() {
//   let jsonRecieved
//   // let jsonStringToSend
//   // alert(data);
//   const decoder = new TextDecoder('windows-1252')

//   const form = {}

//   this.$espconfig
//     .readCredentials()
//     .then((value) => {
//       // console.log(value);
//       // console.log(decoder.decode(value));

//       jsonRecieved = jsonEncodeDecode(value)
//       jsonRecieved = decoder.decode(jsonRecieved)
//       // console.log(jsonRecieved); // debug
//       jsonRecieved = JSON.parse(jsonRecieved)
//       // console.log(jsonRecieved);  // debug
//       return jsonRecieved
//     })
//     .then((jsonRecieved) => {
//       // Update fields (knockout observables)
//       form.ssidPrim = jsonRecieved.ssidPrim
//       form.pwPrim = jsonRecieved.pwPrim
//       form.ssidSec = jsonRecieved.ssidSec
//       form.pwSec = jsonRecieved.pwSec

//       return form
//     })
//   // .then(() => {
//   //   if (this.$espconfig.ssidListUuid) {
//   //     dropdownMessage('Updating SSIDs from device...')
//   //     this.$espconfig.readSsidlist().then((value) => {
//   //       if (value) {
//   //         dropdownMessage('SSID seen by device')
//   //         value = decoder.decode(value)
//   //         value = JSON.parse(value)
//   //         wifiList(value.SSID)
//   //         // console.log(value);
//   //         return value
//   //       } else dropdownMessage()
//   //     })
//   //   }
//   // })
//   // .then(() => {
//   //   if (this.$espconfig.connectionStatusUuid) {
//   //     // this.$espconfig.startConnectionstatusNotifications(statusUpdate)
//   //   }
//   // })
// }

export function jsonEncodeDecode(APName, data) {
  // console.log(value);
  let keyIndex = 0
  for (let i = 0; i < data.byteLength; i++) {
    data.setInt8(i, data.getInt8(i) ^ APName.charCodeAt(keyIndex))
    keyIndex++
    if (keyIndex >= APName.length) keyIndex = 0
  }

  return data
}

// function jsonAssemble(jsonTemplate) {
//   // console.log(jsonTemplate); // debug
//   jsonTemplate = JSON.stringify(jsonTemplate)
//   // console.log(jsonTemplate); // debug
//   jsonTemplate = str2ab(jsonTemplate)
//   // console.log(jsonTemplate); // debug
//   jsonTemplate = jsonEncodeDecode(jsonTemplate)
//   let decoder = new TextDecoder('windows-1252')
//   jsonTemplate = decoder.decode(jsonTemplate)
//   // console.log(jsonTemplate); // debug
//   return jsonTemplate
// }

// From https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
// function str2ab(str) {
//   let buf = new ArrayBuffer(str.length) // 1 byte for each char
//   let bufView = new Int8Array(buf)
//   for (let i = 0, strLen = str.length; i < strLen; i++) {
//     bufView[i] = str.charCodeAt(i)
//   }
//   return new DataView(buf)
// }
