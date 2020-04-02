import {default as layers} from '../layers';
import {addMapLayer, getPolyline, autoFocus} from '../../map';
import { indexes, update, addSelection} from '../../../main/geovisuals';
import {street_total_points} from '../../utils/prepareStreets';

export default function (map, streets) {

    console.log(streets);
    add_semantic_legend(map);

    layers.allStreets.clearLayers();
    streets.forEach( function (street) {

        // Create polyline for each street
        let polyline = getPolyline(street.path, street.color, 3, 1, true);
        let border = getPolyline(street.path, '#000', 4, 1, false);

        // Set all polyline events
        layers.allStreets.addLayer(border);
        layers.allStreets.addLayer(polyline);

        if (street.index !== indexes.list) {
            setMouseOver(polyline, street.name);
            setMouseOut(polyline, street.color);
            setOnClick(polyline, street.index);
        }
    });

    addMapLayer(map, layers.allStreets);
    //autoFocus(map, layers.allStreets);
    let bounds = layers.allStreets.getBounds();
    map.fitBounds(bounds);
    map.setZoom(14);
    return;
}

// TODO: same as trip selection
function setMouseOver (polyline, streetname) {
    polyline.on('mouseover', function (e) {
        let layer = e.target;
        layer.setStyle({ color: '#000', opacity: 1});
        layer.bindTooltip('<strong>Activate ' + streetname + '</strong>');
    });
    return;
}

function setMouseOut (polyline, color) {
    polyline.on('mouseout', function (e) {
        let layer = e.target;
        layer.setStyle({ color: color, opacity: 1});
    });
    return;
}

function setOnClick (polyline, index) {
    polyline.on('click', function (e) {
        addSelection(index);
        update();
    });

    return;
}

function add_semantic_legend(map)
{
    // Fill out 0 score
    for (let i = 0; i < street_total_points.length; ++i) {
        if (street_total_points[i] == 0) {
            street_total_points[i] = (street_total_points[i - 1] + street_total_points[i + 1]) / 2;
        }
    }

    layers.semanticStreets.remove();
    layers.semanticStreets.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');

        $(div).html('<strong> Street SDPs </strong>');

        var colors = ['#bd0026', '#f03b20','#fd8d3c','#fecc5c','#ffffb2'];
        var values = [street_total_points[0], street_total_points[1], street_total_points[2], 
        street_total_points[3], street_total_points[4]];

        for (let i = 0; i < colors.length; ++i) {
            var legend = $('<div/>').css({
                width: '100%',
                cursor: 'pointer',
                color: '#fff',
                'padding-left': '5px',
                'font-weight': 'bold',
                'margin-bottom': '2px'
            }).html('<i class="fa fa-circle" style="color:' + colors[i] + ' " aria-hidden="true"></i>&nbsp; <= &nbsp' + values[i] + ' <i class="fas fa-comments"></i>');
            $(div).append(legend)
        }

        return div;
    };

    layers.semanticStreets.addTo(map);
    return;
}