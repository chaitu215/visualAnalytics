import {default as layers} from '../layers';
import {addMapLayer, getPolyline, getArrow, autoFocus} from '../../map';
import {getImagePath, createImageElement} from '../../utils';
import {addVideo} from '../../video/init';

/**
 * Show selected trips over map
 * @param {*} trips - all trips 
 */
export default function (map, trips) {
    
    // Clear trip layers
    layers.currentTrip.clearLayers();
    trips.forEach( function (trip) {
        // create polyline for each trip
        let polyline = getPolyline(trip.path, 'orange', 8, 1, true);
        let border = getPolyline(trip.path, '#000', 10, 1, true);
        let arrowHead = getArrow(polyline, '#fee0b6', 0, 1, true);
        // Add all shape to current trip layer (bug)
        layers.currentTrip.addLayer(arrowHead);
        layers.currentTrip.addLayer(border);
        layers.currentTrip.addLayer(polyline);

        // Set events
        setMouseOver(layers.currentTrip, trip, map);
        setMouseOut(layers.currentTrip, map);
        // Click to jump video?
        setOnClick(layers.currentTrip, trip);
    });
    
    addMapLayer(map, layers.currentTrip);
    autoFocus(map, layers.currentTrip);
    return;
}

/**
 * Polyline mouseover events
 * Show video images when mouseover a current trip
 * @param {*} polyline 
 */
function setMouseOver (polyline, trip, map) {

    layers.hoverCurrentTrip.clearLayers();

    // Need to add off()
    polyline.off().on('mouseover', function (e) {
        // Algorithms to calculate nearest point over linestring
        let line = getTurfLineString(trip.path);
        let point = turf.point([e.latlng.lng, e.latlng.lat]);
        let nearestPoint = turf.nearestPointOnLine(line, point, {units: 'miles'});
        let index = nearestPoint.properties.index;

        // Create temporary marker
        let tmpMarker = new L.circle(trip.path[index], {opacity: 0, fillOpacity: 0, interactive: false });
        // Get image path
        let pathLeft = getImagePath(    trip.videoLNames[index], 
                                        trip.videoLTimes[index]);
        let pathRight = getImagePath(    trip.videoRNames[index], 
                                        trip.videoRTimes[index]);

        // Create image elements
        let imgLeft = createImageElement(pathLeft, 'hovertrip-image', '', '');
        let imgRight = createImageElement(pathRight, 'hovertrip-image', '', '');

        // Add image to marker
        let container = getTooltipContainer(imgLeft, imgRight);
        // Add tooltip to marker
        tmpMarker.bindTooltip(container.prop('outerHTML'), {
            permanent: true,
            className: 'hovertrip-container',
            offset: [0, 0]
        });

        layers.hoverCurrentTrip.addLayer(tmpMarker);
        addMapLayer(map, layers.hoverCurrentTrip);
        layers.hoverCurrentTrip.bringToFront();
    });

    return;
}

/**
 * Get turf line string from trip path
 * @param {linestring} path - trip path
 */
function getTurfLineString (polyline) {
    let geoLine = [];
    for (var i = 0; i < polyline.length; ++i) {
        var point = [polyline[i][1], polyline[i][0]];
        geoLine.push(point);
    }
    return turf.lineString(geoLine);
}

/**
 * Create tooltip container
 */
function getTooltipContainer (imageLeft, imageRight) {

    let container = $('<div/>').css({
        width: '100%',
        height: '80%'
    });

    let left = $('<div/>').css({
        width: '50%',
        height: '100%',
        float: 'left'
    });
    let right = $('<div/>').css({
        width: '50%',
        height: '100%',
        float: 'left'
    });

    left.append(imageLeft);
    right.append(imageRight);

    return container.append(left).append(right);
}

/**
 * Polyline mouseout events
 * @param {*} polyline 
 */
function setMouseOut (polyline, map) {
    polyline.on('mouseout', function (e) {
        layers.hoverCurrentTrip.clearLayers();
    });
    return;
}

/**
 * Polyline onclick events
 * @param {*} polyline 
 */
function setOnClick (polyline, trip) {
    polyline.on('click', function (e) {
        // Algorithms to calculate nearest point over linestring
        let line = getTurfLineString(trip.path);
        let point = turf.point([e.latlng.lng, e.latlng.lat]);
        let nearestPoint = turf.nearestPointOnLine(line, point, {units: 'miles'});
        let index = nearestPoint.properties.index;
        addVideo(trip, index);
    });
    return;
}