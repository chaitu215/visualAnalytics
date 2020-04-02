import {default as layers} from '../layers';
import {addMapLayer, getPolyline, autoFocus} from '../../map';
import {setListIndex, update, indexes} from '../../../main/geovisuals';

/**
 * Show all trips over map
 * @param {*} map - leaflet map object
 * @param {*} trips - all trips 
 */
export default function (map, trips) {
    // Clear trip layers
    layers.allTrips.clearLayers();
    trips.forEach( function (trip) {
        // create polyline for each trip
        let polyline = getPolyline(trip.path, '#253494', 3, 0.5, true);
        // Set all polyline events
        if (trip.index !== indexes.list) {
            setMouseOver(polyline);
            setMouseOut(polyline);
            setOnClick(polyline, trip.index);
        }

        layers.allTrips.addLayer(polyline);
    });

    addMapLayer(map, layers.allTrips);
    autoFocus(map, layers.allTrips);
    return;
}

/**
 * Polyline mouseover events
 * @param {*} polyline 
 */
function setMouseOver (polyline) {
    polyline.on('mouseover', function (e) {
        let layer = e.target;
        layer.setStyle({ color: 'orange', opacity: 0.8 });
        layer.bindTooltip('<strong>Active this trip</strong>');
    });
    return;
}

/**
 * Polyline mouseout events
 * @param {*} polyline 
 */
function setMouseOut (polyline) {
    polyline.on('mouseout', function (e) {
        let layer = e.target;
        layer.setStyle({ color: '#253494', opacity: 0.5});
    });
    return;
}

/**
 * Polyline onclick events
 * @param {*} polyline 
 */
function setOnClick (polyline, index) {
    polyline.on('click', function (e) {
        setListIndex(index);
        update();
    });
    return;
}