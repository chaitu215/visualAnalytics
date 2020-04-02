import {getPolyline, addMapLayer, autoFocus, layers} from '../../component';
import { indexes, update, addSelection} from '../../../main/geovisuals';

export default function (map, streets) {
    layers.allStreets.clearLayers();
    streets = addSentimentScore(streets);

    for (let i = 0; i < streets.length; ++i) {
        let street = streets[i];
        var polyline = getPolyline(street.path, street.color, 3, 1, true);
        var border = getPolyline(street.path, '#000', 4, 1, false);

        // Set all polyline events
        layers.allStreets.addLayer(border);
        layers.allStreets.addLayer(polyline);

        // Change this based on street selection
        if (indexes.lists.indexOf(i + 1) !== -1) {
            setMouseOver(polyline, street.name);
            setMouseOut(polyline, street.color);
            setOnClick(polyline, i);
        }
    }

    /*
    streets.forEach( function (street) {
        // Create polyline for each street
        var polyline = getPolyline(street.path, street.color, 3, 1, true);
        var border = getPolyline(street.path, '#000', 4, 1, false);

        // Set all polyline events
        layers.allStreets.addLayer(border);
        layers.allStreets.addLayer(polyline);

        // Not the street index
        if (street.index !== indexes.list) {
            setMouseOver(polyline, street.name);
            setMouseOut(polyline, street.color);
            setOnClick(polyline, street.index);
        }
    });*/

    addMapLayer(map, layers.allStreets);
    autoFocus(map, layers.allStreets);
    createLegend(map);
    return streets;
}

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

function createLegend (map) {
    
    var colors = ['#006837','#1a9850','#66bd63', '#a6d96a', '#d9ef8b', '#fee08b', '#fdae61', '#f46d43','#d73027'];
    var scores = ['> 85','> 75','> 50', '> 0', '> -25', '> -50', '> -75', '> -85','> -90'];
    layers.streetSematicLegend.remove();
    layers.streetSematicLegend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        //var labels = ['<strong> Occurred Date </strong>'];
        $(div).html('<strong> Sentiment Score </strong>');
        // Create circle for each point
        var i = 0;
        colors.forEach( color => {

            var sentimentContainer = $('<div/>').css({ width: '100%', cursor: 'pointer' });
            sentimentContainer.html('<i class="fa fa-circle" style="color:' + color + ' " aria-hidden="true"></i>&nbsp;' + (scores[i] ? scores[i] : '+'));
            // Add specific date container
            $(div).append(sentimentContainer);
            i++;
        });
        return div;
    };
    layers.streetSematicLegend.addTo(map);
    return;
}

/**
 * Add street color by normalization
 */
export function addSentimentScore (streets) {

    function normalize (value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    let min = Infinity, max = 0;
    streets.forEach( street => {
        let totalSentiment = 0;
        street.sentiments.forEach( score => {
            totalSentiment += score;
        });
        // Finding average score
        street.score = totalSentiment / street.sentiments.length;
        if (street.score < min) { min = street.score; }
        if (street.score > max) { max = street.score; }
    });

    streets.forEach( street => {
        street.score = normalize(street.score, [min, max], [-100, 100]);
        street.color = getSentimentColor(street.score);
    });

    return streets;
}


function getSentimentColor (d) {
    return  d > 85 ? '#006837' :
            d > 75 ? '#006837' :
            d > 50 ? '#1a9850' :
            d > 25 ? '#66bd63' :
            d > 0 ? '#a6d96a' :
            d > -25 ? '#d9ef8b' :
            d > -50 ? '#fee08b' :
            d > -75 ? '#fdae61' :
            d > -85 ? '#f46d43' : '#d73027';
}