"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bindEvents = _interopRequireDefault(require("../utils/bindEvents.js"));

var _bindProps = require("../utils/bindProps.js");

var _mountableMixin = _interopRequireDefault(require("../utils/mountableMixin.js"));

var _TwoWayBindingWrapper = _interopRequireDefault(require("../utils/TwoWayBindingWrapper.js"));

var _WatchPrimitiveProperties = _interopRequireDefault(require("../utils/WatchPrimitiveProperties.js"));

var _mapElementFactory = require("./mapElementFactory.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var props = {
  zoom: {
    twoWay: true,
    type: Number
  },
  pov: {
    twoWay: true,
    type: Object,
    trackProperties: ['pitch', 'heading']
  },
  position: {
    twoWay: true,
    type: Object,
    noBind: true
  },
  pano: {
    twoWay: true,
    type: String
  },
  motionTracking: {
    twoWay: false,
    type: Boolean
  },
  visible: {
    twoWay: true,
    type: Boolean,
    default: true
  },
  options: {
    twoWay: false,
    type: Object,
    default: function _default() {
      return {};
    }
  }
};
var events = ['closeclick', 'status_changed'];
var _default = {
  mixins: [_mountableMixin.default],
  props: (0, _mapElementFactory.mappedPropsToVueProps)(props),
  replace: false,
  // necessary for css styles
  methods: {
    resize: function resize() {
      if (this.$panoObject) {
        google.maps.event.trigger(this.$panoObject, 'resize');
      }
    }
  },
  provide: function provide() {
    var _this = this;

    var promise = new Promise(function (resolve, reject) {
      _this.$panoPromiseDeferred = {
        resolve: resolve,
        reject: reject
      };
    });
    return {
      '$panoPromise': promise,
      '$mapPromise': promise // so that we can use it with markers

    };
  },
  computed: {
    finalLat: function finalLat() {
      return this.position && typeof this.position.lat === 'function' ? this.position.lat() : this.position.lat;
    },
    finalLng: function finalLng() {
      return this.position && typeof this.position.lng === 'function' ? this.position.lng() : this.position.lng;
    },
    finalLatLng: function finalLatLng() {
      return {
        lat: this.finalLat,
        lng: this.finalLng
      };
    }
  },
  watch: {
    zoom: function zoom(_zoom) {
      if (this.$panoObject) {
        this.$panoObject.setZoom(_zoom);
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    return this.$gmapApiPromiseLazy().then(function () {
      // getting the DOM element where to create the map
      var element = _this2.$refs['vue-street-view-pano']; // creating the map

      var options = _objectSpread({}, _this2.options, {}, (0, _bindProps.getPropsValues)(_this2, props));

      delete options.options;
      _this2.$panoObject = new google.maps.StreetViewPanorama(element, options); // binding properties (two and one way)

      (0, _bindProps.bindProps)(_this2, _this2.$panoObject, props); // binding events

      (0, _bindEvents.default)(_this2, _this2.$panoObject, events); // manually trigger position

      (0, _TwoWayBindingWrapper.default)(function (increment, decrement, shouldUpdate) {
        // Panos take a while to load
        increment();

        _this2.$panoObject.addListener('position_changed', function () {
          if (shouldUpdate()) {
            _this2.$emit('position_changed', _this2.$panoObject.getPosition());
          }

          decrement();
        });

        (0, _WatchPrimitiveProperties.default)(_this2, ['finalLat', 'finalLng'], function updateCenter() {
          increment();

          _this2.$panoObject.setPosition(_this2.finalLatLng);
        });
      });

      _this2.$panoPromiseDeferred.resolve(_this2.$panoObject);

      return _this2.$panoPromise;
    }).catch(function (error) {
      throw error;
    });
  }
};
exports.default = _default;