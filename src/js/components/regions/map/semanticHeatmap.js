import {layers, addMapLayer, autoFocus} from '../../component';

export default function (cells, map) {

    layers.regionSemanticHeatmap.clearLayers();
    
    // grid color
    function gridColor (d) {
        return  d > 80  ? '#800026' :
                d > 70  ? '#BD0026' :
                d > 55  ? '#E31A1C' :
                d > 35  ? '#FC4E2A' :
                d > 25  ? '#FD8D3C' :
                d > 15  ? '#FEB24C' :
                d > 5   ? '#FED976' : '#f0f0f0';
    }

    // grid style
    let gridStyle = {
        style: function style(feature) {
            return {
                fillColor: gridColor(feature.properties.count),
                weight: 0.5,
                opacity: 0.5,
                color: '#fff',
                fillOpacity: 0.6,
            };
        },
        // cell events
        onEachFeature: cellEvents
    }

    layers.regionSemanticHeatmap.addLayer(L.geoJSON(cells, gridStyle));
    addMapLayer(map, layers.regionSemanticHeatmap);
    //autoFocus(map, layers.regionSemanticHeatmap);
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

function add_semantic_legend(map, cells)
{
    console.log(cells);
    return;
}