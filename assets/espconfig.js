class Espconfig {

    constructor(namePrefix = "ESP32", serviceUuid = "0000aaaa-ead2-11e7-80c1-9a214cf093ae", credentialsUuid = "00005555-ead2-11e7-80c1-9a214cf093ae",
        ssidListUuid = null, connectionStatusUuid = null, onConnected = null, onDisconnected = null, listener = null) {
        this.device = null;
        this.onDisconnected = this.onDisconnected.bind(this);

        // Device UUIDs and name
        this.namePrefix = null;
        this.serviceUuid = null;
        this.credentialsUuid = null;
        this.ssidListUuid = null;
        this.connectionStatusUuid = null;

        // Configure with specified parameters.
        this.setNamePrefix(namePrefix);
        this.setServiceUuid(serviceUuid);
        this.setCredentialsUuid(credentialsUuid);
        this.setSsidListUuid(ssidListUuid);
        this.setConnectionStatusUuid(connectionStatusUuid);
        this.setOnConnected(onConnected);
        this.setOnDisconnected(onDisconnected);
        // this.setNotificationListener(listener);
    }

    setNamePrefix(namePrefix) {
        this.namePrefix = namePrefix;
    }

    setServiceUuid(uuid) {
        if (!Number.isInteger(uuid) && !(typeof uuid === 'string' || uuid instanceof String)) {
          throw new Error('UUID type is neither a number nor a string');
        }
    
        if (!uuid) {
          throw new Error('UUID cannot be a null');
        }
    
        this.serviceUuid = uuid;
    }

    setCredentialsUuid(uuid) {
        if (!Number.isInteger(uuid) && !(typeof uuid === 'string' || uuid instanceof String)) {
          throw new Error('UUID type is neither a number nor a string');
        }
    
        if (!uuid) {
          throw new Error('UUID cannot be a null');
        }
    
        this.credentialsUuid = uuid;
    }

    setSsidListUuid(uuid) {
        if (uuid && (!Number.isInteger(uuid) && !(typeof uuid === 'string' || uuid instanceof String))) {
          throw new Error('UUID type is neither a number nor a string');
        }
    
        this.ssidListUuid = uuid;
    }

    setConnectionStatusUuid(uuid) {
        if (uuid && (!Number.isInteger(uuid) && !(typeof uuid === 'string' || uuid instanceof String))) {
          throw new Error('UUID type is neither a number nor a string');
        }
    
        this.connectionStatusUuid = uuid;
    }

    setOnConnected(listener) {
        this._onConnected = listener;
    }

    setOnDisconnected(listener) {
        this._onDisconnected = listener;
    }
    
    request() {
        let options = {
            "filters": [{
            "namePrefix": this.namePrefix
            }],
            "optionalServices": [this.serviceUuid]
        };
        return navigator.bluetooth.requestDevice(options)
        .then(device => {
            this.device = device;
            this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
        });
    }
    
    connect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.connect().
        then(() => {
            if (this._onConnected) {
              this._onConnected();
            }
        });
    }
    
    getDeviceName() {
        if (!this.device) {
          return '';
        }
    
        return this.device.name;
    }

    readCredentials() {
        return this.device.gatt.getPrimaryService(this.serviceUuid)
        .then(service => service.getCharacteristic(this.credentialsUuid))
        .then(characteristic => characteristic.readValue());
    }
  
    writeCredentials(data) {
        return this.device.gatt.getPrimaryService(this.serviceUuid)
        .then(service => service.getCharacteristic(this.credentialsUuid))
        .then(characteristic => characteristic.writeValue(new TextEncoder().encode(data)));
    }
  
    readSsidlist() {
        return this.device.gatt.getPrimaryService(this.serviceUuid)
        .then(service => service.getCharacteristic(this.ssidListUuid))
        .then(characteristic => characteristic.readValue())
        .catch(error => {
            console.log(error);
            return null;
        });
    }

    startConnectionstatusNotifications(listener) {
        return this.device.gatt.getPrimaryService(this.serviceUuid)
        .then(service => service.getCharacteristic(this.connectionStatusUuid))
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => characteristic.addEventListener('characteristicvaluechanged', listener))
        .catch(error => {
            console.log(error);
            return null;
        });
    }
    
    stopConnectionstatusNotifications(listener) {
        return this.device.gatt.getPrimaryService(this.serviceUuid)
        .then(service => service.getCharacteristic(this.connectionStatusUuid))
        .then(characteristic => characteristic.stopNotifications())
        .then(characteristic => characteristic.removeEventListener('characteristicvaluechanged', listener))
        .catch(error => {
            console.log(error);
            return null;
        });
    }
    
    disconnect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.disconnect();
    }
  
    onDisconnected() {
        console.log('Device is disconnected.')
        
        if (this._onDisconnected) {
            this._onDisconnected();
        }
    }
}

// Export class as a module to support requiring.
/* istanbul ignore next */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Espconfig;
}

// var espconfig = new Espconfig();
  
// document.querySelector('button').addEventListener('click', event => {
//         espconfig.request()
//         .then(_ => espconfig.connect())
//         .then(_ => { /* Do something with espconfig... */})
//         .catch(error => { console.log(error) });
// });