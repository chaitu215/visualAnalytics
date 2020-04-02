import {dom, addWordCloudBtn} from '../../ui';
import {setSelectOnRoi, setRoiIndex, update, setListIndex} from '../../../main/geovisuals';

export default function (collections, regions, data) {

    const container = dom.roiContent;  
    container.empty();

    // List all city
    let regionHeader = getRegionHeader('region-1', 'All City');
    container.append(regionHeader);
    let regionContainer = getRegionContainer("region-1");
    data.forEach(function (d) {
        let tripContainer = getTripContainer(d, "region-1");
        regionContainer.append(tripContainer);
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

function getTripContainer (trip, regionID) {
    let text = 'Trip '+ trip.index + ' (' + trip.date.replace(new RegExp('-', 'g'), '/') + ')';
    let tripDiv = $('<div/>', {
        // Important!
        id: regionID + '-' + trip.index,
        class: 'list-container'
    }).html(text);
    
    // Add wordcloud button
    addWordCloudBtn(tripDiv, trip);

    tripDiv.on('click', function (e) {
        e.stopPropagation();
        setSelectOnRoi(false);
        setRoiIndex(regionID.split('-')[1]);
        setListIndex(trip.index);
        update();
    });

    // Mouseover events.
    tripDiv.on("mouseover", function (event) {

    });

    tripDiv.on("mouseout", function (event) {
    
    });

    return tripDiv;
}