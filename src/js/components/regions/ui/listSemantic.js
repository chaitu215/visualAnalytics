import {dom, addWordCloudBtn} from '../../component';
import { setSelectOnRoi, setRoiIndex, update, setListIndex, addSelection, removeSelection } from '../../../main/geovisuals';

export default function (cells, indexes) {
    const container = dom.roiContent; 
    container.empty();
    
    // List all city
    let regionHeader = getRegionHeader('region-1', 'All City');
    container.append(regionHeader);
    let regionContainer = getRegionContainer("region-1");
    // iterate through grid cell
    let index = 0;
    cells.features.forEach(function (cell) {
        // get all narrative and keyword for specific cell
        let narratives = cell.properties.narrative;
        //let cell[properties][]
        // Need to fix this
        let keywords = cell.properties.keyword;
        let count = narratives.length;

        // Set active status
        let active = false;
        if (indexes.indexOf(index) !== -1) {
            active = true;
        }

        // create region that have narrative
        if (narratives.length > 0) {
            regionContainer.append(getCellContainer(index, 'region-1', cell, active));
        }

        index++;
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

function getCellContainer (index, regionID , cell, active) {

    console.log(cell);

    let cellDiv = $("<div/>", {
        id: regionID +  '-' + index,
        class: (active) ? 'list-container active' : 'list-container'
    }).html('Region ' + (index + 1));

    // Add wordcloud
    //addWordCloudBtn(cellDiv, cell.properties.narrative);

    cellDiv.on('click', function (e) {
        e.stopPropagation();
        cellDiv.toggleClass('active');
        if (cellDiv.hasClass('active')) {
            addSelection(index);
        } else {
            removeSelection(index);
        }
        setSelectOnRoi(false);
        setRoiIndex(regionID.split('-')[1]);
        update();
    });

    return cellDiv;
}