import { createMap, resetMap, addMapLayer, resizeMap } from '../../component';
import { default as dom } from './ui/dom';

export var map = undefined;

export default function (location)
{
    var containerId = dom.map.attr('id');
    var markerLayer = new L.featureGroup();

    markerLayer.clearLayers();
    if (map) {
        resetMap(map);
        map = createMap(containerId);
        // create marker

    } else {
        map = createMap(containerId);
    }

    let pulseIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: 'red',
        heartbeat: 1
    });

    // Add pulse icon to the marker
    let marker = L.marker(location, {
        icon: pulseIcon
    });
    markerLayer.addLayer(marker);
    addMapLayer(map, markerLayer);

    var bounds = markerLayer.getBounds();
    map.fitBounds(bounds);
    resizeMap(map);
    return;
}