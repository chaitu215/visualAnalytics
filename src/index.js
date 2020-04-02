// Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// D3 wordcloud
import 'd3-cloud';
// Jquery ui
import 'webpack-jquery-ui';
import 'webpack-jquery-ui/css';
// Leaflet
import 'leaflet/dist/leaflet.css';
// Leaflet polyline decorator
import 'leaflet-polylinedecorator';
// Leaflet marker cluster
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
// Leaflet rotated marker
import 'leaflet-rotatedmarker';
// Leaflet pulse icons
import '../node_modules/@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css';
import '../node_modules/@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.js';
/**
 * CSS
 */
import './css/main.css';
import './css/videoPlayer.css';
import './css/segnetPlayer.css';
import './css/semanticBubble.css';
import './css/sentimentChart.css';
import './css/keywordTree.css';
import './css/map.css';
import './css/detailView.css';
import './css/region.css';
import './css/gallery.css';
import './css/compare.css';
import './css/mapbox.css';

/**
 * JS
 */
import {start} from './js/main/geovisuals';

$(window).on('load', function () {
    return start();
});