import {default as layers} from '../layers';
import {addMapLayer, getPolyline, autoFocus} from '../../map';

export default function (map, streets) {

    layers.selectStreets.clearLayers();
    // Add street color
    streets.forEach( function (street) {

        // Create polyline for each selected street
        let polyline = getPolyline(street.path, street.color, 6, 1, true).bindPopup(street.name);
        let border = getPolyline(street.path, '#000', 9, 1, true);

        // Set mouseevents over polyline
        setMouseover(polyline, street, map);
        setMouseOut(polyline, map);

        
        /*
        polyline.bindTooltip(street.name, { 
            permanent: true, 
            className: 'streetNameTooltip',
            direction: 'top'
        });*/

        layers.selectStreets.addLayer(border);
        layers.selectStreets.addLayer(polyline);
    });
    addMapLayer(map, layers.selectStreets);
    autoFocus(map, layers.selectStreets);
    return;
}

function setMouseover (polyline, street, map) {
    polyline.on('mouseover', function (e) {
        console.log(street.name);
    });
} 

function setMouseOut (polyline, map) {
    polyline.on('mouseout', function (e) {
        console.log('mouseout');
    });
    return;
}