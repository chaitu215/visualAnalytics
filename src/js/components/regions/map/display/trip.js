import { getPolyline, addMapLayer, autoFocus } from '../../../component';
import { default as layers } from '../layers';
import { getCurrentMap } from '../../../../main/geovisuals';

export default function (trips) {
    var map = getCurrentMap();
    // clear default trip layers
    layers.defaultTrip.clearLayers();

    trips.forEach ( (trip) => {
        var polyline = getPolyline( trip.path, '#000', 1, 0.3, false);
        layers.defaultTrip.addLayer(polyline);
    });

    addMapLayer(map, layers.defaultTrip);
    autoFocus(map, layers.defaultTrip);

    return;
}