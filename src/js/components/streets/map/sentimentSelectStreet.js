import { layers, addMapLayer, getPolyline, autoFocus} from '../../component';

export default function (map, streets, sentiments) {
    //console.log(sentiments);
    layers.selectStreets.clearLayers();
    function getColor (streetName) {
        let color = undefined;
        sentiments.datasets.forEach( street => {
            if (street.label === streetName) {
                color = street.backgroundColor;
            }
        });
        return color;
    }

    streets.forEach( street => {
        // Get color by street name
        let color = getColor (street.name);
        let polyline = getPolyline(street.path, color, 6, 1, true)
                        .bindPopup(street.name);

        polyline.bindTooltip(street.name, { 
            permanent: true, 
            className: 'streetNameTooltip',
            direction: 'top'
        });
        
        let border = getPolyline(street.path, '#000', 8, 1, true);
        layers.selectStreets.addLayer(border);
        layers.selectStreets.addLayer(polyline);
    });
    addMapLayer(map, layers.selectStreets);
    autoFocus(map, layers.selectStreets);
    return;
}


/*
export default function (map, streets, colors) {
    layers.selectStreets.clearLayers();

    console.log(colors);

    function getColor (arrays, name) {
        let color = undefined;
        arrays.forEach( function (a) {
            if (name == a.name) {
                color = a.color;
            }
        });
        return color;
    }

    // Add street color
    streets.forEach( function (street) {
        // Create polyline for each selected street
        let polyline = getPolyline(street.path, street.color, 6, 1, true).bindPopup(street.name);
        let c = getColor(colors, street.name);
        let border1 = getPolyline(street.path, c, 12, 1, true);
        let border2 = getPolyline(street.path, '#000', 14, 1, true);
        layers.selectStreets.addLayer(border2);
        layers.selectStreets.addLayer(border1);
        layers.selectStreets.addLayer(polyline);
    });
    addMapLayer(map, layers.selectStreets);
    autoFocus(map, layers.selectStreets);
    return;
}
*/