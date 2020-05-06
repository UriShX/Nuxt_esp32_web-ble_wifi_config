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

export function jsonAssemble(APName, jsonTemplate) {
  jsonTemplate = JSON.stringify(jsonTemplate)
  jsonTemplate = str2ab(jsonTemplate)
  jsonTemplate = jsonEncodeDecode(APName, jsonTemplate)
  const decoder = new TextDecoder('windows-1252')
  jsonTemplate = decoder.decode(jsonTemplate)

  return jsonTemplate
}

// From https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function str2ab(str) {
  const buf = new ArrayBuffer(str.length) // 1 byte for each char
  const bufView = new Int8Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return new DataView(buf)
}
