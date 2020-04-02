import { layers, autoFocus, addMapLayer} from '../../../component';
import { default as regionLayers } from '../layers';
import { getCurrentMap, addSelection, removeSelection, update } from '../../../../main/geovisuals';
/**
 * Display sentiment heatmap
 */
export default function (cells, indexes) {
    regionLayers.heatmap.clearLayers();
    cells = addSentimentScore(cells);
    console.log(cells);

    let map = getCurrentMap();

    cells.forEach( cell => {

        let gridStyle = {
            style: function style(feature) {
                return {
                    fillColor: cell.color,
                    fillOpacity: 0.35,
                    weight: (indexes.indexOf(cell.index) !== -1) ? 4 : 1,
                    opacity: 1,
                    color: cell.borderColor
                }
            },
            onEachFeature: cellEvents
        }

        regionLayers.heatmap.addLayer(L.geoJSON(cell.geometry, gridStyle));
    });

    addMapLayer(map, regionLayers.heatmap);
    //autoFocus(map, regionLayers.heatmap);
    create_legend(map);
    return cells;
}

/**
 * compute sentiment score
 * @param {*} cells 
 */
export function addSentimentScore (cells) {

    function normalize (value , r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    let min = Infinity, max = 0;
    cells.forEach( cell => {
        let totalSentiment = 0;
        // sum all sentiment score inside each region
        cell.sentiments.forEach( score => {
            totalSentiment += score;
        });
        // finding average score
        if (cell.sentiments.length > 0) {
            cell.score = totalSentiment / cell.sentiments.length;
        } else {
            cell.score = 0;
        }

        if (cell.score < min) { min = cell.score; }
        if (cell.score > max) { max = cell.score; }
    });

    // compute new key value for this object
    // between -100 and 100
    cells.forEach( cell => {
        if (cell.sentiments.length > 0) {
            cell.score = normalize(cell.score, [min, max], [-100, 100]);
            cell.color = getSentimentColor(cell.score);
            cell.borderColor = '#000';
        } else {
            cell.score = 0;
            cell.color = 'rgba(255, 255, 255, 0)';
            cell.borderColor = 'rgba(255, 255, 255, 0)';
        }
    })

    return cells;
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

function cellEvents (feature, layer) {

    let map = getCurrentMap();
    // layer events
    layer.on({
        click: onClick,
        mouseover: onMouseOver,
        mouseout: onMouseOut
    });

    // on click events
    function onClick(e) {
        let index = e.target.feature.properties.index;

        if (e.target.feature.properties.select) {
            removeSelection(index);
        } else {
            addSelection(index);
        }
        
        update();
    }

    function onMouseOver (e) {
        let layer = e.target;
        let index = e.target.feature.properties.index;
        let total = e.target.feature.properties.total;

        if (total > 1) {
            layer.bindPopup('<strong> Region ' + index + '</strong>').openPopup();
        }
    }

    function onMouseOut (e) {
        let layer = e.target;
        map.closePopup();
    }

    return;    
}

function create_legend(map)
{
    var colors = ['#006837','#1a9850','#66bd63', '#a6d96a', '#d9ef8b', '#fee08b', '#fdae61', '#f46d43','#d73027'];
    var scores = ['> 85','> 75','> 50', '> 0', '> -25', '> -50', '> -75', '> -85','> -90'];
    
    regionLayers.sentimentRegionLegend.remove();
    regionLayers.sentimentRegionLegend.onAdd = function (map) {
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
    regionLayers.sentimentRegionLegend.addTo(map);
    return;
}