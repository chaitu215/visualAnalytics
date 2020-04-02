import {layers, addMapLayer, autoFocus} from '../../component'

export default function (cells, map) {

    layers.regionSentimentHeatmap.clearLayers();
    // grid color
    function gridColor (d) {
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

    // grid style
    let gridStyle = {
        style: function style(feature) {
            return {
                fillColor: gridColor(feature.properties.score),
                weight: 0.5,
                opacity: 0.5,
                color: '#fff',
                fillOpacity: 0.8
            };
        },
        // cell events
        onEachFeature: cellEvents
    }
    layers.regionSentimentHeatmap.addLayer(L.geoJSON(cells, gridStyle));
    
    addMapLayer(map, layers.regionSentimentHeatmap);
    //autoFocus(map, layers.regionSentimentHeatmap);
    return;
}

// create cell events
function cellEvents (feature, layer) {
    
    // layer events
    layer.on({
        click: onClick
    });

    // on click events
    function onClick(e) {
        e.target.setStyle({ opacity: 1, color: '#000', weight: 2});
        console.log(e.target);
    }

    return;
}