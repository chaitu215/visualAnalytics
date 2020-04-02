import {dom, addWordCloudBtn} from '../../ui';
import {setSelectOnRoi, setRoiIndex, update, setListIndex, addSelection ,removeSelection} from '../../../main/geovisuals';

/**
 * 
 * @param {*} data - streets data
 * @param {*} indexes - for setting active for selected street
 */
export default function (data, indexes) {
    
    const container = dom.roiContent;
    container.empty();

    // List all city
    let regionHeader = getRegionHeader('region-1', 'All City');
    container.append(regionHeader);
    let regionContainer = getRegionContainer("region-1");

    // Set the selection
    var i = 1;
    data.forEach(function (d) {
        if (indexes.indexOf(i) !== -1) {
            let streetContainer = getStreetContainer(d, "region-1", true, i);
            regionContainer.append(streetContainer);
        }
        ++i;
    });

    i = 1;
    data.forEach(function (d) {
        if (indexes.indexOf(i) === -1) {
            let streetContainer = getStreetContainer(d, "region-1", false, i);
            regionContainer.append(streetContainer);
        }
        ++i
    });

    container.append(regionContainer);

    return;
}

function getRegionHeader (id, text) {
    let header = $('<div/>', {
        id: id,
        title: "show trips",
        class: "region-header"
    });

    header.html(text);

    header.on('mouseover', function () {
        if (!$('#' + id + "-trips").is(':visible')) {

        }
    })
    
    header.hover(function () {
        if (!$('#' + id + "-trips").is(':visible')) {
            $(this).css({
                'background': '#e0e0e0',
            });
        }
    }, function () {
        if (!$('#' + id + "-trips").is(':visible')) {
            $(this).css({
                'background': '#f0f0f0',
            });
        }
    });

    // TODO: need to fix this
    header.on('click', function (e) {
        // Get roi selected Index
        e.stopPropagation();

        setRoiIndex(id.split('-')[1]);
        setSelectOnRoi(true);
        update();
    });

    return header;
}

function getRegionContainer (id) {
    return $('<div/>', {
        id: id + "-trips",
        class: 'region-body'
    });
}

function getStreetContainer (street, regionID, active, index) {
    let text = street.name;
    let streetDiv = $('<div/>', {
        // Important!
        id: regionID + '-' + index,
        class: (active) ? 'active' : ''
        //class://(active) ? 'list-container active' : 'list-container'
    }).css({
        background: (active) ? '#ffeda0' : '#fff',
        'border-bottom': '1px solid #000',
        width: '100%',
        'padding-left': '5px',
        height: 'auto',
        'border-bottom': '1px solid #e0e0e0',
        cursor: 'pointer',
        overflow: 'auto'
    }).html(text);
    
    // Add wordcloud button
    addWordCloudBtn(streetDiv, street);

    streetDiv.on('click', function (e) {
        e.stopPropagation();
        streetDiv.toggleClass('active');
        if (streetDiv.hasClass('active')) {
            addSelection(index);
        } else {
            removeSelection(index);
        }

        setSelectOnRoi(false);
        setRoiIndex(regionID.split('-')[1]);
        update();
    });

    // Mouseover events.
    streetDiv.on("mouseover", function (event) {
        // Need to add this
    });

    streetDiv.on("mouseout", function (event) {
    
    });

    return streetDiv;
}