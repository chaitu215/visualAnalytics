import { default as dom } from './dom';
import { createImageElement, getImagePath, calculateBearing, addImgCompass } from '../../../component';
import { default as addMap } from '../addMap';
import { default as addGSV } from '../addGsv';

export var currentLocation = undefined; 

/**
 * Find nearest sdps with parent and child
 * @param {*} parent 
 * @param {*} childs 
 */
export default function (parent, childs)
{
    // Clear list of all sdps
    dom.sdps.empty();

    currentLocation = parent.latlng;

    // need to set map here
    addMap(currentLocation);
    addGSV(currentLocation);
    // need to set google street view here
    // addGSV(parent.latlng);

    // Set parent
    var parentContainer = getContainer(0);
    parentContainer = addDetail(parent, parentContainer);
    dom.sdps.append(parentContainer);

    // Set all childs
    var i = 1;
    childs.forEach( child => {
        var childContainer = getContainer(i);
        childContainer = addDetail(child, childContainer);
        dom.sdps.append(childContainer);

        ++i;
    });
}

/**
 * create container
 */
function getContainer (id)
{
    var container = $('<div/>',{
        id: 'compare-container-' + id
    }).css({
        'font-size': '12px',
        width: '100%',
        height: '200px',
        position: 'relative'
    });

    return container;
}

function addDetail (point, container)
{
    var detailContainer = $('<div/>').css({
        width: '100%',
        height: 'calc(100% - 30px)',
        position: 'relative',
        'margin-top': '2px'
    });

    var imageContainer = $('<div/>').css({
        width: '100%', height: '100%', position: 'relative',
        'text-align': 'center'
    });

    var LStr = $('<div/>').css({
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: '#fff',
        'font-weight': 'bold',
        'text-shadow': '2px 2px #000',
        'z-index': 2000
    }).html('L');

    var RStr = $('<div/>').css({
        position: 'absolute',
        top: '10px',
        right: '20px',
        color: '#fff',
        'font-weight': 'bold',
        'text-shadow': '2px 2px #000',
        'z-index': 2000
    }).html('R');

    var left = createImageElement(point.leftImg, 'compare-point-imgleft', '', '');
    var right = createImageElement(point.rightImg, 'compare-point-imgleft', '', '');

    var dateStr = $('<div/>').css({
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        color: 'yellow',
        'font-weight': 'bold',
        background: 'rgba(0, 0, 0, 0.4)'
    }).html(point.date);

    imageContainer.append(left).append(right).append(dateStr).append(LStr).append(RStr);
    // Add compass for each images
    let bearing = calculateBearing(point.trip.path[point.pointIndex], point.trip.path[point.pointIndex + 1]);
    addImgCompass(imageContainer, bearing);
    detailContainer.append(imageContainer);//.append(narrativeContainer);

    // Slider sections
    var sliderContainer = $('<div/>').css({
        width: '100%',
        height: '30px'
    });

    // create slider
    var slider =  $('<input/>', {
        type: 'range',
        min: -10,
        value: 0,
        max: 10,
        class: 'compare-slider'
    });

    /*
    var leftBtn = $('<button/>', {
        type: 'button',
        class: 'compare-leftright-btn'
    }).html('<i class="fa fa-caret-left" aria-hidden="true"></i>');
    var rightBtn = $('<button/>', {
        type: 'button',
        class: 'compare-leftright-btn'
    }).html('<i class="fa fa-caret-right" aria-hidden="true"></i>');*/
    //sliderContainer.append(leftBtn).append(slider).append(rightBtn);
    sliderContainer.append(slider);

    slider.on('input', () => {
        var newIndex = point.pointIndex + parseInt(slider.val());
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex > point.trip.path.length) {
            // need to check on this
            newIndex = point.trip.path.length - 1;
        }
        // update images
        imageContainer.empty();
        var pathLeft = getImagePath(point.trip.videoLNames[newIndex], point.trip.videoLTimes[newIndex]);
        var pathRight = getImagePath(point.trip.videoRNames[newIndex], point.trip.videoRTimes[newIndex])

        var LStr = $('<div/>').css({
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: '#fff',
            'font-weight': 'bold',
            'text-shadow': '2px 2px #000',
            'z-index': 2000
        }).html('L');

        var RStr = $('<div/>').css({
            position: 'absolute',
            top: '10px',
            right: '20px',
            color: '#fff',
            'font-weight': 'bold',
            'text-shadow': '2px 2px #000',
            'z-index': 2000
        }).html('R');

        var left = createImageElement(pathLeft, 'compare-point-imgleft', '', '');
        var right = createImageElement(pathRight, 'compare-point-imgleft', '', '');

        var dateStr = $('<div/>').css({
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: 'yellow',
            'font-weight': 'bold',
            background: 'rgba(0, 0, 0, 0.4)'
        }).html(point.date);

        imageContainer.append(left).append(right).append(dateStr).append(LStr).append(RStr);
        let bearing = calculateBearing(point.trip.path[point.pointIndex], point.trip.path[point.pointIndex + 1]);
        addImgCompass(imageContainer, bearing);
        addNarrative(container, point.trip.narratives[newIndex]);
    });

    /*
    leftBtn.on('click', () => {
        var value = parseInt(slider.val()) - 1;
        slider.val(value);

        var newIndex = point.pointIndex + value;
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex > point.trip.path.length) {
            // need to check on this
            newIndex = point.trip.path.length - 1;
        }
        // update images
        imageContainer.empty();
        var pathLeft = getImagePath(point.trip.videoLNames[newIndex], point.trip.videoLTimes[newIndex]);
        var pathRight = getImagePath(point.trip.videoRNames[newIndex], point.trip.videoRTimes[newIndex]);

        var LStr = $('<div/>').css({
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: '#fff',
            'font-weight': 'bold',
            'text-shadow': '2px 2px #000',
            'z-index': 2000
        }).html('L');

        var RStr = $('<div/>').css({
            position: 'absolute',
            top: '10px',
            right: '20px',
            color: '#fff',
            'font-weight': 'bold',
            'text-shadow': '2px 2px #000',
            'z-index': 2000
        }).html('R');

        var left = createImageElement(pathLeft, 'compare-point-imgleft', '', '');
        var right = createImageElement(pathRight, 'compare-point-imgleft', '', '');

        var dateStr = $('<div/>').css({
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: 'yellow',
            'font-weight': 'bold',
            background: 'rgba(0, 0, 0, 0.4)'
        }).html(point.date);

        imageContainer.append(left).append(right).append(dateStr).append(LStr).append(RStr);
        let bearing = calculateBearing(point.trip.path[point.pointIndex], point.trip.path[point.pointIndex + 1]);
        addImgCompass(imageContainer, bearing);
        addNarrative(container, point.trip.narratives[newIndex]);
    });

    rightBtn.on('click', () => {
        var value = parseInt(slider.val()) + 1;
        slider.val(value);

        var newIndex = point.pointIndex + value;
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex > point.trip.path.length) {
            // need to check on this
            newIndex = point.trip.path.length - 1;
        }
        // update images
        imageContainer.empty();
        var pathLeft = getImagePath(point.trip.videoLNames[newIndex], point.trip.videoLTimes[newIndex]);
        var pathRight = getImagePath(point.trip.videoRNames[newIndex], point.trip.videoRTimes[newIndex])

        var LStr = $('<div/>').css({
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: '#fff',
            'font-weight': 'bold',
            'text-shadow': '2px 2px #000',
            'z-index': 2000
        }).html('L');

        var RStr = $('<div/>').css({
            position: 'absolute',
            top: '10px',
            right: '20px',
            color: '#fff',
            'font-weight': 'bold',
            'text-shadow': '2px 2px #000',
            'z-index': 2000
        }).html('R');

        var left = createImageElement(pathLeft, 'compare-point-imgleft', '', '');
        var right = createImageElement(pathRight, 'compare-point-imgleft', '', '');

        var dateStr = $('<div/>').css({
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: 'yellow',
            'font-weight': 'bold',
            background: 'rgba(0, 0, 0, 0.4)'
        }).html(point.date);

        imageContainer.append(left).append(right).append(dateStr).append(LStr).append(RStr);
        
        let bearing = calculateBearing(point.trip.path[point.pointIndex], point.trip.path[point.pointIndex + 1]);
        addImgCompass(imageContainer, bearing);
        addNarrative(container, point.trip.narratives[newIndex]);
    });*/

    //addNarrative(container, point.trip.narratives[point.pointIndex]);

    container.append(detailContainer).append(sliderContainer);
    addNarrative(container, point.trip.narratives[point.pointIndex]);
    return container;

}

/**
 * Add narrative under an image
 * @param {*} container 
 */
function addNarrative (container, narrative)
{
    $('#' + container.attr('id') + '-narrative').remove();

    var div = $('<div/>', {
        id: container.attr('id') + '-narrative'
    }).css({
        width: '100%',
        height: 'auto',
        padding: '5px'
    }).html(narrative);

    if (narrative !== 'none') {
        container.after(div);
    }

    return;
}