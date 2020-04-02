import {dom} from '../../ui';
import {getCurrentMap} from '../../../main/geovisuals';
export default function (data) {

    var layerItem = $('<div/>', {
        class: 'layer-item'
    });

    layerItem.append(getCheckbox(data));
    layerItem.append('&nbsp;&nbsp;' + data.name + '&nbsp;&nbsp;');
    layerItem.append(getRemoveButton(layerItem, data));

    dom.layerContainer.append(layerItem);
    return;
}

// checkbox 
function getCheckbox (data) {

    var checkbox = $('<input/>', {
        type: 'checkbox'
    });

    checkbox.click( () => {
        if( checkbox.is(':checked') ) {
            getCurrentMap().addLayer(data.layer);
        } else {
            getCurrentMap().removeLayer(data.layer);
        }
    });

    return checkbox;
}

// remove layer button
function getRemoveButton (container, data) {
    var button = $('<button/>', {
        class: 'removeLayer-btn'
    }).html('<i class="fa fa-trash" aria-hidden="true"></i>');
    button.click( (e) => {
        e.stopPropagation();
        container.remove();
        getCurrentMap().removeLayer(data.layer);
    });
    return button;
}