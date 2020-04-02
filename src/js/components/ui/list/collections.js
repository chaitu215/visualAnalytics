import {dom} from '../../ui';
import {indexes, setDataIndex, update} from '../../../main/geovisuals';

export default function (index, data) {
    // Reset dataset content
    dom.dataContent.empty();
    data.forEach( function (collection) {
        // Create div element for each collection.
        let div = $('<div/>', {
            id: 'collection_' + collection.index,
            class: (collection.index == index) ? 'collection-location active' : 'collection-location'
        }).css({
            'font-size': '12px',
            'padding-left': '5px',
            'width': '100%',
            'height': 'auto',
            'background': (collection.index == index) ? '#ffeda0' :
            'none' ,
            'cursor': 'pointer'
        });
        
        addDatabaseIcon(div, collection.name);
        setOnClickEvent(div, collection.index);
        dom.dataContent.append(div);
    });

    return;
}

// Add database icon and collection name.
function addDatabaseIcon(div, collectionName) {
    // Addding capital leter
    let name = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);

    div.append(' <i class="fa fa-database" aria-hidden="true" style="color: #fe9929;"></i>&nbsp;&nbsp' + name);
    return;
}

// Set onclick event to div element.
function setOnClickEvent(div, index) {
    div.on('click', function () {
        // Index is not equal to current collection index.
        if (index !== indexes.data) {
            setDataIndex(index);
            // Update geovisuals system.
            update();
            return;
        }
    });
    return;
}