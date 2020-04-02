import { default as layers } from '../layers';
import { addMapLayer, autoFocus } from '../../../component';
import { getCurrentMap, addSelection, removeSelection, update } from '../../../../main/geovisuals';

export var current_indexes = undefined;

export default function (cells, indexes) {
    
    current_indexes = indexes;

    let map = getCurrentMap();
    add_semantic_legend(map);
    layers.heatmap.clearLayers();
    // get colors by total sdps count
    function getFillColor (d) {
        return  d > 80  ? '#800026' :
                d > 70  ? '#BD0026' :
                d > 55  ? '#E31A1C' :
                d > 35  ? '#FC4E2A' :
                d > 25  ? '#FD8D3C' :
                d > 15  ? '#FEB24C' :
                d > 5   ? '#FED976' : 
                d > 3   ? '#ffeda0' : 
                d > 1   ? '#ffffcc' : 'rgba(255, 255, 255, 0)';
    }

    function getBorderColor (list, index, total) {
        if (list.indexOf(index) !== -1) {
            return '#000';
        } else {
            if (total > 1) {
                return '#000';
            } else {
                return 'rgba(255, 255, 255, 0)';
            }
        }
    }

    cells.forEach(cell => {

        let gridStyle = {
            style: function style (feature) {
                return {
                    fillColor: getFillColor(feature.properties.total),
                    fillOpacity: 0.35,
                    weight: (indexes.indexOf(cell.index) !== -1) ? 4 : 1,
                    opacity: 1,
                    color: getBorderColor(indexes, cell.index, feature.properties.total)
                }
            },
            // add cell events
            onEachFeature: cellEvents
        }

        layers.heatmap.addLayer(L.geoJSON(cell.geometry, gridStyle));
    });

    addMapLayer(map, layers.heatmap);
    getCurrentMap().setZoom(13);
    autoFocus(map, layers.heatmap);
    return;
}

function cellEvents (feature, layer) {

    let map = getCurrentMap();

    // layer events
    layer.on({
        //add: add_tooltip,
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
        
        // TODO: Change this to not reload the view.
        update();
    }

    function onMouseOver (e) {
        let layer = e.target;
        let index = e.target.feature.properties.index;
        let total = e.target.feature.properties.total;

        if (total > 1) {
            //layer.bindPopup('<strong> Region ' + index + '</strong>').openPopup();
        }
    }

    function onMouseOut (e) {
        let layer = e.target;
        map.closePopup();
    }

    // Show selected region tooltip
    function add_tooltip(e) {
        let layer = e.target;
        let index = e.target.feature.properties.index;
        let total = e.target.feature.properties.total;

        if (current_indexes.indexOf(index) !== -1) {
            if (total > 1) {
                layer.bindTooltip('<strong> Region ' + index + '</strong>', { 
                    permanent: true, 
                    className: 'streetNameTooltip',
                    direction: 'top',
                    offset: [0, -10]
                });
            }
        }
    }

    return;    
}

function add_semantic_legend(map)
{

    // Clear region semantic legend
    layers.semanticRegionLegend.remove();
    layers.semanticRegionLegend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');

        $(div).html('<strong> Region SDPs </strong>');

        var colors = ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C', '#FEB24C', '#FED976'];
        var values = [70, 50, 30, 20, 10, 5];

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
    }

    layers.semanticRegionLegend.addTo(map);
    return;
}