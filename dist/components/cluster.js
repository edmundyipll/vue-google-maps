"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _markerClustererPlus = _interopRequireDefault(require("marker-clusterer-plus"));

var _mapElementFactory = _interopRequireDefault(require("./mapElementFactory.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  batchSizeIE: {
    type: Number,
    twoWay: false
  },
  calculator: {
    type: Function,
    twoWay: false
  },
  enableRetinaIcons: {
    type: Boolean,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  averageCenter: {
    type: Boolean,
    twoWay: false
  },
  ignoreHidden: {
    type: Boolean,
    twoWay: false
  },
  imageExtension: {
    type: String,
    twoWay: false
  },
  imagePath: {
    type: String,
    twoWay: false
  },
  imageSizes: {
    type: Array,
    twoWay: false
  },
  minimumClusterSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  },
  zoomOnClick: {
    type: Boolean,
    twoWay: false
  }
};
var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

var _default = (0, _mapElementFactory.default)({
  mappedProps: props,
  events: events,
  name: 'cluster',
  ctr: function ctr() {
    if (typeof _markerClustererPlus.default === 'undefined') {
      /* eslint-disable no-console */
      console.error('MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js');
      throw new Error('MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js');
    }

    return _markerClustererPlus.default;
  },
  ctrArgs: function ctrArgs(_ref) {
    var map = _ref.map,
        otherOptions = _objectWithoutProperties(_ref, ["map"]);

    return [map, [], otherOptions];
  },
  render: function render(h) {
    // <div><slot></slot></div>
    return h('div', this.$slots.default);
  },
  afterCreate: function afterCreate(inst) {
    var reinsertMarkers = function () {
      var oldMarkers = inst.getMarkers();
      inst.clearMarkers();
      inst.addMarkers(oldMarkers);
    };

    for (var prop in props) {
      if (props[prop].twoWay) {
        this.$on(prop.toLowerCase() + '_changed', reinsertMarkers);
      }
    }
  },
  updated: function updated() {
    if (this.$clusterObject) {
      this.$clusterObject.repaint();
    }
  },
  beforeDestroy: function beforeDestroy() {
    var _this = this;

    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach(function (marker) {
      if (marker.$clusterObject === _this.$clusterObject) {
        marker.$clusterObject = null;
      }
    });

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers();
    }
  }
});

exports.default = _default;