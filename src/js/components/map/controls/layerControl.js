import { default as layers } from '../layers';
import { default as controls } from './controls';

// Add Layer control to the map
export default function (map) {

    let overlayMap = {};

    // Reset controls
    controls.layerControl.remove();

    Object.keys(layers).forEach(function(layer) {
        // Check if layer exist on current map
        if (map.hasLayer(layers[layer])) {
            overlayMap[layer] = layers[layer];
        }
    });

    controls.layerControl = L.control.layers(null, overlayMap, {position: 'bottomleft'})
    controls.layerControl.addTo(map);
    return;
}