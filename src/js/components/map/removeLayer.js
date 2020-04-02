import { default as layers } from './layers';
import { default as regionLayers } from '../regions/map/layers';
import { default as streetLayers } from '../streets/map/layers';

/**
 * Remove all layer from the map
 * @param {*} map 
 */
export default function (map) {
    Object.keys(layers).forEach(function(layer) {
        // Check if layer existed on current map
        if (map.hasLayer(layers[layer])) {
            map.removeLayer(layers[layer]);
        }
    });

    // remove region layers
    Object.keys(regionLayers).forEach( (layer) => {

        if (map.hasLayer(regionLayers[layer])) {
            map.removeLayer(regionLayers[layer]);
        }

    });

    // remove street layers
    Object.keys(streetLayers).forEach( (layer) => {

        if (map.hasLayer(streetLayers[layer])) {
            map.removeLayer(streetLayers[layer]);
        }

    });

    // Remove legends
    layers.streetSematicLegend.remove();
    layers.currentKeywords.remove();
    layers.semanticStreets.remove();
    regionLayers.semanticRegionLegend.remove();
    regionLayers.sentimentRegionLegend.remove();

    return;
}