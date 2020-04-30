// Spoof yourlocation by overriding navigator actual geolocation w/ WeWork ha-Zerem's coordinates
navigator.geolocation.getCurrentPosition = function(success, failure) {
    success({ coords: {
        latitude: 32.050608,
        longitude: 34.766928,
    }, timestamp: Date.now() });
    failure({ coords: {
        latitude: 32.050607,
        longitude: 34.766927,
    }, timestamp: Date.now() });
}

navigator.geolocation.watchPosition = function(success, failure) {
    success({ coords: {
        latitude: 32.050605,
        longitude: 34.766925,
    }, timestamp: Date.now() });
    failure({ coords: {
        latitude: 32.050606,
        longitude: 34.766926,
    }, timestamp: Date.now() });
}