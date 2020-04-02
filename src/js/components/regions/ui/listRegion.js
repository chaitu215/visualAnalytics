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

    data.forEach(function (d) {
        if (indexes.indexOf(d.index) !== -1) {
            var cellContainer = getCellContainer(d, "region-1", true);
            regionContainer.append(cellContainer);
        }
    });

    data.forEach(function (d) {
        if (indexes.indexOf(d.index) === -1) {
            var cellContainer = getCellContainer(d, "region-1", false);
            regionContainer.append(cellContainer);
        }
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

function getCellContainer (cell, regionID, active) {

    let text = 'Region ' + cell.index;
    let cellDiv = $('<div/>', {
        // Important!
        id: regionID + '-' + cell.index,
        class: (active) ? 'list-container active' : 'list-container'
    }).html(text);
    
    // Add wordcloud button
    addWordCloudBtn(cellDiv, cell);

    cellDiv.on('click', function (e) {
        e.stopPropagation();
        cellDiv.toggleClass('active');
        if (cellDiv.hasClass('active')) {
            addSelection(cell.index);
        } else {
            removeSelection(cell.index);
        }

        setSelectOnRoi(false);
        setRoiIndex(regionID.split('-')[1]);
        update();
    });

    // Mouseover events.
    cellDiv.on("mouseover", function (event) {
        // Need to add this
    });

    cellDiv.on("mouseout", function (event) {
    
    });

    return cellDiv;
}