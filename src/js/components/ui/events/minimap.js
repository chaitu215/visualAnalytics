import {dom} from '../../ui';
import {createMap, layers, getPolyline, getCircleMarker, addMapLayer, resetMap, resizeMap, getVideoMarker} from '../../map';

export let currentMap = undefined;
export let otherMap = [];

/**
 * Show minimap container
 */
export function showMinimap (map) {
    // Reset minimap container
    dom.minimapContainer.empty();
    dom.minimapContainer.width();
    dom.minimapContainer.show();
    // Shrink map container
    dom.mapContainer.css({ width: '75%'});
    // Resize main map
    resizeMap(map);
    return;
}

/**
 * Hide minimap container
 */
export function hideMinimap (map) {
    // Reset minimap container
    dom.minimapContainer.empty();
    dom.minimapContainer.hide();
    // Expand width of the map container
    dom.mapContainer.css({ width: '100%'});
    // Resize main map
    resizeMap(map);
    return;
}

/**
 * Initialize minimap with all trips and current trip
 * @param {*} trips - all trips inside the region
 * @param {*} trip - current trip
 */
export function initMinimap (trips, trip) {

    let otherTrips = [];
    trips.forEach( function (t) {
        // Compare with current trip index
        // Or first if it all roi selection
        if (t.index !== trip[0].index) {
            otherTrips.push(t);
        }
    });

    // Show all minimap
    showCurrentTripMinimap(trip[0]);
    //showOtherTripMinimap(otherTrips, trip[0].path[0]);
    return;
}

/**
 * Show current trip on the minimap
 * @param {*} trip - current trip
 */
function showCurrentTripMinimap (trip) {
    if (currentMap) {
        // Reset current map
        resetMap(currentMap);
    }
    
    let mapId = dom.videoPlayerMinimap.attr('id');
    let map = createMap(mapId);
    // Set global current map
    currentMap = map;
    // Disable all map interaction
    disableAllInteraction(map);
    // Add current trip to minimap
    layers.videoMinimap.clearLayers();
    let polyline = getPolyline(trip.path, 'orange', 8, 1, false);
    let polylineBorder = getPolyline(trip.path, '#000', 10, 1, true);
    layers.videoMinimap.addLayer(polylineBorder);
    layers.videoMinimap.addLayer(polyline);
    for (let i = 0; i < trip.narratives.length; ++i) {
        let narrative = trip.narratives[i];
        let point = trip.path[i];
        if (narrative !== "none") {
            let circle = getCircleMarker(point, '#000', '#41ab5d', 0.8, {});
            layers.videoMinimap.addLayer(circle);
        }
    }
    // Add layers to minimap
    addMapLayer(map, layers.videoMinimap);
    // Add current location marker
    addCurrentMinimapMarker(trip.path[0]);
    return;
}

/**
 * Add current minimap marker
 * @param {[Latitude, Longitude]} location 
 */
export function addCurrentMinimapMarker (location) {
    // Clear current minimap marker
    layers.currentMinimapMarker.clearLayers();
    // New person icon
    /*
    let personIcon = L.icon({
        iconUrl: "./images/marker/person.png",
        iconSize: [35, 35]
    });
    // Create new person marker
    let marker = new L.marker(location, {
        id: "person-marker",
        icon: personIcon
    });*/
    var currentMarker  = getVideoMarker(location, '#000', '#4cff00', 1, {});
    // Adding to layer
    layers.currentMinimapMarker.addLayer(currentMarker);
    currentMap.addLayer(layers.currentMinimapMarker);
    // Focus on current location marker
    var bounds = layers.currentMinimapMarker.getBounds();
    return currentMap.panInsideBounds(bounds);
}

/**
 * Show other trip minimap
 * @param {*} trips - array of all trips
 * @param {*} currentPoint - current trip marker (video marker)
 */
function showOtherTripMinimap(trips, currentPoint) {

    // Reset other leaflet minimap
    otherMap = [];

    // Get minimap container
    function getMinimapContainer (trip) {
        let div = $("<div/>", {
            id: 'minimap-' + trip.index,
            class: 'minimap-elements'
        });
        return div;
    }

    function getMinimapDate (date) {
        return $("<div/>", {
            class: 'minimap-date'
        }).html(date);
    }

    trips.forEach ( function (trip) {
        // Get all minimap and date container
        let container = getMinimapContainer(trip);
        let dateDiv = getMinimapDate(trip.date);
        container.append(dateDiv);
        dom.minimapContainer.append(container);
        // Create minimap items 
        let map = createMap(container.attr('id'));
        disableAllInteraction(map);
        // Important
        let mapItem = {
            layer: new L.FeatureGroup(),
            path: trip.path,
            map: map
        }
        otherMap.push(mapItem);
        // Show current point of current trip.
        addOtherLocation(currentPoint);
    });

    return;
}

/**
 * Add current trip marker and polyline
 * @param {[Latitude, Longitude]} location 
 */
export function addOtherLocation (location) {
    otherMap.forEach( function (mapItem) {
        // Create map item layers
        mapItem.layer.clearLayers();

        // Get polyline layer
        let start = getCircleMarker(mapItem.path[0], '#000', 'green', 1, {});
        let polyline = getPolyline(mapItem.path, '#000', 2, 1, false);
        let stop = getCircleMarker(mapItem.path[mapItem.path.length - 1], '#000', 'red', 1, {});

        let pulseIcon = L.icon.pulse({
            iconSize: [5, 5],
            color: '#2166ac',
            heartbeat: 3
        });

        let marker = L.marker(location, {
            icon: pulseIcon
        });

        mapItem.layer.addLayer(polyline)
                    .addLayer(start)
                    .addLayer(stop)
                    .addLayer(marker);

        mapItem.map.addLayer(mapItem.layer);
        let bounds = mapItem.layer.getBounds();
        mapItem.map.flyToBounds(bounds);
    });

    return;
}

/**
 * Disable all minimap interaction
 * @param {*} map 
 * @param {*} divId 
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