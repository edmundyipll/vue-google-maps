"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
exports.gmapApi = gmapApi;
Object.defineProperty(exports, "loadGmapApi", {
  enumerable: true,
  get: function get() {
    return _manager.loadGmapApi;
  }
});
Object.defineProperty(exports, "Marker", {
  enumerable: true,
  get: function get() {
    return _marker.default;
  }
});
Object.defineProperty(exports, "Polyline", {
  enumerable: true,
  get: function get() {
    return _polyline.default;
  }
});
Object.defineProperty(exports, "Polygon", {
  enumerable: true,
  get: function get() {
    return _polygon.default;
  }
});
Object.defineProperty(exports, "Circle", {
  enumerable: true,
  get: function get() {
    return _circle.default;
  }
});
Object.defineProperty(exports, "Rectangle", {
  enumerable: true,
  get: function get() {
    return _rectangle.default;
  }
});
Object.defineProperty(exports, "InfoWindow", {
  enumerable: true,
  get: function get() {
    return _infoWindow.default;
  }
});
Object.defineProperty(exports, "Map", {
  enumerable: true,
  get: function get() {
    return _map.default;
  }
});
Object.defineProperty(exports, "StreetViewPanorama", {
  enumerable: true,
  get: function get() {
    return _streetViewPanorama.default;
  }
});
Object.defineProperty(exports, "PlaceInput", {
  enumerable: true,
  get: function get() {
    return _placeInput.default;
  }
});
Object.defineProperty(exports, "Autocomplete", {
  enumerable: true,
  get: function get() {
    return _autocomplete.default;
  }
});
Object.defineProperty(exports, "MapElementMixin", {
  enumerable: true,
  get: function get() {
    return _mapElementMixin.default;
  }
});
Object.defineProperty(exports, "MapElementFactory", {
  enumerable: true,
  get: function get() {
    return _mapElementFactory.default;
  }
});
Object.defineProperty(exports, "MountableMixin", {
  enumerable: true,
  get: function get() {
    return _mountableMixin.default;
  }
});
exports.Cluster = void 0;

var _lazyValue = _interopRequireDefault(require("./utils/lazyValue"));

var _manager = require("./manager");

var _marker = _interopRequireDefault(require("./components/marker"));

var _polyline = _interopRequireDefault(require("./components/polyline"));

var _polygon = _interopRequireDefault(require("./components/polygon"));

var _circle = _interopRequireDefault(require("./components/circle"));

var _rectangle = _interopRequireDefault(require("./components/rectangle"));

var _infoWindow = _interopRequireDefault(require("./components/infoWindow.vue"));

var _map = _interopRequireDefault(require("./components/map.vue"));

var _streetViewPanorama = _interopRequireDefault(require("./components/streetViewPanorama.vue"));

var _placeInput = _interopRequireDefault(require("./components/placeInput.vue"));

var _autocomplete = _interopRequireDefault(require("./components/autocomplete.vue"));

var _mapElementMixin = _interopRequireDefault(require("./components/mapElementMixin"));

var _mapElementFactory = _interopRequireDefault(require("./components/mapElementFactory"));

var _mountableMixin = _interopRequireDefault(require("./utils/mountableMixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// HACK: Cluster should be loaded conditionally
// However in the web version, it's not possible to write
// `import 'vue2-google-maps/src/components/cluster'`, so we need to
// import it anyway (but we don't have to register it)
// Therefore we use babel-plugin-transform-inline-environment-variables to
// set BUILD_DEV to truthy / falsy
var Cluster = undefined;
exports.Cluster = Cluster;
var GmapApi = null; // export everything

function install(Vue, options) {
  // Set defaults
  options = _objectSpread({
    installComponents: true,
    autobindAllEvents: false
  }, options); // Update the global `GmapApi`. This will allow
  // components to use the `google` global reactively
  // via:
  //   import {gmapApi} from 'vue2-google-maps'
  //   export default {  computed: { google: gmapApi }  }

  GmapApi = new Vue({
    data: {
      gmapApi: null
    }
  });
  var defaultResizeBus = new Vue(); // Use a lazy to only load the API when
  // a VGM component is loaded

  var gmapApiPromiseLazy = makeGmapApiPromiseLazy(options);
  Vue.mixin({
    created: function created() {
      this.$gmapDefaultResizeBus = defaultResizeBus;
      this.$gmapOptions = options;
      this.$gmapApiPromiseLazy = gmapApiPromiseLazy;
    }
  });
  Vue.$gmapDefaultResizeBus = defaultResizeBus;
  Vue.$gmapApiPromiseLazy = gmapApiPromiseLazy;

  if (options.installComponents) {
    Vue.component('GmapMap', _map.default);
    Vue.component('GmapMarker', _marker.default);
    Vue.component('GmapInfoWindow', _infoWindow.default);
    Vue.component('GmapPolyline', _polyline.default);
    Vue.component('GmapPolygon', _polygon.default);
    Vue.component('GmapCircle', _circle.default);
    Vue.component('GmapRectangle', _rectangle.default);
    Vue.component('GmapAutocomplete', _autocomplete.default);
    Vue.component('GmapPlaceInput', _placeInput.default);
    Vue.component('GmapStreetViewPanorama', _streetViewPanorama.default);
  }
}

function makeGmapApiPromiseLazy(options) {
  // Things to do once the API is loaded
  function onApiLoaded() {
    GmapApi.gmapApi = {};
    return window.google;
  }

  if (options.load) {
    // If library should load the API
    return (0, _lazyValue.default)(function () {
      // Load the
      // This will only be evaluated once
      if (typeof window === 'undefined') {
        // server side -- never resolve this promise
        return new Promise(function () {}).then(onApiLoaded);
      } else {
        return new Promise(function (resolve, reject) {
          try {
            window['vueGoogleMapsInit'] = resolve;
            (0, _manager.loadGmapApi)(options.load, options.loadCn);
          } catch (err) {
            reject(err);
          }
        }).then(onApiLoaded);
      }
    });
  } else {
    // If library should not handle API, provide
    // end-users with the global `vueGoogleMapsInit: () => undefined`
    // when the Google Maps API has been loaded
    var promise = new Promise(function (resolve) {
      if (typeof window === 'undefined') {
        // Do nothing if run from server-side
        return;
      }

      window['vueGoogleMapsInit'] = resolve;
    }).then(onApiLoaded);
    return (0, _lazyValue.default)(function () {
      return promise;
    });
  }
}

function gmapApi() {
  return GmapApi.gmapApi && window.google;
}