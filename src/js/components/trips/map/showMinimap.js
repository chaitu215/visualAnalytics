import {resetMap, getCircleMarker, getPolyline, addMapLayer, autoFocus, createMap, resizeMap} from '../../component';

import {indexes, update, getCurrentTrip} from '../../../main/geovisuals';

export var minimap = undefined;

/**
 * 
 * @param {*} location 
 * @param {*} trip - it is a other trip
 * @param {*} pointIndex 
 */
export default function (location, trip, pointIndex)
{
    if (minimap) {
        resetMap(minimap);
    }

    // Create leaflet minimap 
    minimap = createMap('equalizer-minimap');
    resizeMap(minimap);
    // Disable all map interaction
    disableAllInteraction(minimap);
    
    let minimapLayer = new L.FeatureGroup();

    // Create other trip layer
    let start = getCircleMarker(trip.path[0], '#000', 'green', 1, {});
    let polyline = getPolyline(trip.path, '#000', 2, 1, false);
    let stop = getCircleMarker(trip.path[trip.path.length - 1], '#000', 'red', 1, {});

    // This will get the current trip
    let currentTrip = getCurrentTrip();
    let currentTripPolyline = getPolyline(currentTrip.path, 'blue', 2, 1, false);

    // Marker pulse icons
    let pulseIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: 'red',
        heartbeat: 1
    });

    // Add pulse icon to the marker
    let marker = L.marker(location, {
        icon: pulseIcon
    });

    // Add layer to the current minimap
    minimapLayer//.addLayer(currentTripPolyline)
                .addLayer(polyline)
                .addLayer(start)
                .addLayer(stop)
                .addLayer(marker);

    addMapLayer(minimap, minimapLayer);
    //autoFocus(minimap, minimapLayer);
    // Fit the entire map to the layer without animation
    var bounds = minimapLayer.getBounds();
    minimap.fitBounds(bounds);

    // Add switch trip button
    addSwitchTripButton(trip, pointIndex);
    return;
}

/**
 * Disable all interaction over the map
 * @param {*} map - minimap container
 */
function disableAllInteraction (map) {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    return;
}

/**
 * Create switch trip button and add to the minimap container
 * @param {*} trip 
 */
function addSwitchTripButton (trip, index)
{
    var minimapContainer = document.getElementById('equalizer-minimap');
    var button = document.createElement('button');

    // Set all of the css attributes
    button.style.position = "absolute";
    button.style.cursor = "pointer";
    button.style.width = "auto";
    button.style.height = "auto";
    button.style.fontSize = "12px";
    button.style.bottom = "2px";
    button.style.left = "2px";
    button.style.zIndex = "1000";
    button.style.background = "#252525";
    button.style.color = "#ffffff";
    // Set text to the button
    button.innerHTML = "Switch Trip <i class='fa fa-chevron-right' aria-hidden='true'></i>";

    button.addEventListener('click', function () {
        indexes.currentPointIndex = index;
        indexes.list = trip.index;
        update();
    });

    minimapContainer.appendChild(button);
    return;
}