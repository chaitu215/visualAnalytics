import { dom, getImagePath, createImageElement } from '../../component';
import {default as Mark} from 'mark.js';
import { default as layers } from '../map/layers';
import { addMapLayer } from '../../map';
import { getCurrentMap } from '../../../main/geovisuals';

export default function (items, selectedKeywords)
{
    open_detail_view();

    //dom.sdpContainer.empty();
    $("#sdp").hide();
    $("#sdp").nextAll().remove();

    var index = 0;
    items.forEach( item => {
        let container = get_container(item);
        // Add images
        add_Images(container, item, index);
        add_image_slider(container, item, index);
        add_narratives(container, item, index);
        dom.sdpContainer.append(container);
        index++;
    });

    var context = document.querySelectorAll(".keywordtree-sentence");
    var instance = new Mark(context);
    instance.mark(selectedKeywords);

    return;
}

function open_detail_view()
{
    dom.visContainer.css({ width : "calc(100% - 45%)" });
    dom.sdpContainer.css({ width: "30%" });
    return;
}

function get_container(item)
{
    let container = $('<div/>').css({
        width: '99.5%',
        height: '33.3%',
        'border-radius': '5px',
        'margin-top': '2px',
        'padding': '5px',
        'cursor': 'pointer',
        background: '#fee0d2',
        border: '2px solid #fc9272',
    });

    container.hover( () => {
        // Clear keyword tree point map layer
        layers.keywordTreePoint.clearLayers();
        
        let pulseIcon = L.icon.pulse({
            iconSize: [20, 20],
            color: 'red',
            heartbeat: 1
        })

        console.log(item.path);

        let marker = L.marker(item.path, {
            icon: pulseIcon
        });

        // Add new marker to keyword tree point
        layers.keywordTreePoint.addLayer(marker);
        addMapLayer(getCurrentMap(), layers.keywordTreePoint);
        let bounds = layers.keywordTreePoint.getBounds();
        getCurrentMap().panInsideBounds(bounds);

    }, () => {
        layers.keywordTreePoint.clearLayers();
    });

    return container;
}

function add_Images(container, point, index)
{
    let image_container = $('<div/>').css({
        width: '100%',
        height: '40%'
    });

    let image_left = $('<div/>', { id: 'keywordtree-point-left' + index }).css({
        width: '49%',
        height: '100%',
        border: '2px solid #000',
        'border-radius': '5px',
        float: 'left'
    });

    let image_right = $('<div/>', { id: 'keywordtree-point-right' + index }).css({
        width: '49%',
        height: '100%',
        border: '2px solid #000',
        'border-radius': '5px',
        float: 'left',
        'margin-left': '5px'
    });

    image_left.append(createImageElement(getImagePath(point.videoLNames, point.videoLTimes), 'point-image', '',''));
    image_right.append(createImageElement(getImagePath(point.videoRNames, point.videoRTimes), 'point-image', '',''));

    image_container.append(image_left).append(image_right);
    container.append(image_container);

    return;
}

function add_narratives(container, point, index)
{

    let narrative_container = $('<div/>', {
        id: 'keywordtree-sentence-' + index, 
        class: 'keywordtree-sentence'
    }).css({
        width: '100%',
        height: '50%',
        color: '#000',
        'text-align': 'justify',
        'overflow': 'auto',
        'font-size': '14px',
        'padding-top': '10px'
    }).html(point.narrative);

    container.append(narrative_container);

    return;
}

function add_image_slider(container, point, image_index)
{
    //console.log(point);
    let slider_container = $('<div/>').css({
        width: '100%',
        height: '5%'
    });

    let slider = $('<input/>', {
        type: 'range',
        min: -10,
        value: 0,
        max: 10,
        class: 'keywordtree-slider'
    });

    slider.on('input', () => {
        
        let newIndex = point.pointIndex + parseInt(slider.val());
        console.log(newIndex);

        // Avoid index out of bounds
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex > point.trip.path.length) {
            // need to check on this
            newIndex = point.trip.path.length - 1;
        }

        var pathLeft = getImagePath(point.trip.videoLNames[newIndex], point.trip.videoLTimes[newIndex]);
        var pathRight = getImagePath(point.trip.videoRNames[newIndex], point.trip.videoRTimes[newIndex]);

        // Change images
        $('#keywordtree-point-right' + image_index).empty();
        $('#keywordtree-point-left' + image_index).empty();
        $('#keywordtree-sentence-' + image_index).empty();

        $('#keywordtree-point-right' + image_index).append(createImageElement(pathRight, 'point-image', '',''));
        $('#keywordtree-point-left' + image_index).append(createImageElement(pathLeft, 'point-image', '',''));
        $('#keywordtree-sentence-' + image_index).append(point.trip.narratives[newIndex]);

    });

    slider_container.append(slider);
    container.append(slider_container);

    return;
}