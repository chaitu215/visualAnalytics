import { default as layers } from './layers'

export default function resetMapbox(map)
{
    console.log(map);

    for (var key in layers) {
        if (!layers.hasOwnProperty(key)) continue;

        var layer = layers[key];

        var mapLayer = map.getLayer(layer['id']);
        if (typeof mapLayer !== 'undefined') {
            // Remove map layer & source
            map.removeLayer(layer['id']);
            map.removeSource(layer['id']);
        }
    }
    
    return;
}