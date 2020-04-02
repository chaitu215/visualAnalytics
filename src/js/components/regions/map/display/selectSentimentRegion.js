import { default as layers } from '../layers';
import { addMapLayer, autoFocus } from '../../../component';
import { getCurrentMap, addSelection, removeSelection, update } from '../../../../main/geovisuals';

/**
 * Show selected region of sentiments mode
 * @param {*} regions 
 */
export default function (regions) {

    layers.selectRegion.clearLayers();
    let map = getCurrentMap();

    regions.datasets.forEach( region => {
        let geometry = region.geometrys[0];
        let borderColor = '#000';//region.backgroundColor;
        console.log(geometry)
        console.log(borderColor);

        let cellStyle = {
            style: function style(feature) {
                return {
                    fillColor: '#000',
                    fillOpacity: 0,
                    weight: 4,
                    opacity: 1,
                    color: borderColor
                }
            },
            onEachFeature: cellEvents
        }

        layers.selectRegion.addLayer(L.geoJSON(geometry, cellStyle));
    });

    addMapLayer(map, layers.selectRegion);
    //autoFocus(map, layers.selectRegion);

    return;
}


function cellEvents (feature, layer) {

    let map = getCurrentMap();
    // layer events
    layer.on({
        //add: add_tooltip, Remove add tooltip
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

    function add_tooltip(e)
    {
        let layer = e.target;
        let index = e.target.feature.properties.index;
        let total = e.target.feature.properties.total;

        layer.bindTooltip('<strong> Region ' + index + '</strong>', { 
            permanent: true, 
            className: 'streetNameTooltip',
            direction: 'top',
            offset: [0, -20]
        });
        
    }

    return;
}