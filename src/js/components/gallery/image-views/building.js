import { selectedStreets } from '../../streets/vis/bubble';
import { getStreetname, createImageElement, resetMap, createMap, resizeMap, autoFocus, addMapLayer } from '../../component'
import {getAllTrips , getCurrentLocationName} from '../../../main/geovisuals';
import { default as dom } from '../ui-element';
import potpack from 'potpack';
import {default as Mark} from 'mark.js';

export var minimap = undefined;
export var locationLayer = L.featureGroup();
export default function building(keywords)
{
    // Set selected keywords
    let str = "<strong>Selected Keywords:</strong>";
    keywords.forEach( word => {
        str += " " + word;
    });
    $('#gallery-keywords').html(str);


    let streets = [];
    selectedStreets.forEach( street => {
        streets.push(street.name);
    });

    dom.imageContainer.empty();
    // Add new canvas
    /*
    let canvas = $('<canvas/>', {
        id: 'canvas'
    }).css({
        border: '1px solid #ccc', 
        'margin-bottom': '5px'
    });
    dom.imageContainer.append(canvas);*/


    let data = prepareData(keywords, streets);
    getAllDimensions(data).then( result => {
        setTimeout(function() {
            
            // find average
            /*
            var totalRectArea = 0;
            result.forEach( img => {
                totalRectArea += (img.h * img.w);
            })

            var avgRectArea = totalRectArea / result.length;*/
            
            // Filter image with dimensions
            let filteredImage = [];
            result.forEach( img => {
                //let area = img.h * img.w;
                if (img.h > 50 && img.w > 50) {
                    filteredImage.push(img);
                }
            });

            createGallery(filteredImage, keywords);

        }, 3000);
    }).catch(e => {
        console.log(e);
    });

    //console.log(dimensions);
}

/**
 * 
 * @param {*} images 
 */
function createGallery (images, keywords)
{
    // TODO: reuse this to d3
    const {w, h, fill} = potpack(images);

    // Clear current image container
    dom.imageContainer.empty();
    // Get width and height
    let width = dom.imageContainer.width();
    let height = width * h / w;//dom.imageContainer.height();

    let svg = d3.select('#' + dom.imageContainer.attr('id'))
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    const r = width / w;
    let index = 0;

    for (const box of images) {

        svg.append("defs")
            .append("pattern")
            .attr("id", "image-" + index)
            .attr('patternUnits', 'objectBoundingBox')
            .attr("width", 1)
            .attr("height", 1)
            .append("image")
            .attr('x', 0)
            .attr('y', 0)
            .attr("width", box.w * r)
            .attr("height", box.h * r)
            .attr("xlink:href", box.src);

        let rect = svg.append('rect')
                    .attr('x', box.x * r)
                    .attr('y', box.y * r)
                    .attr('width', box.w * r)
                    .attr('height', box.h * r)
                    .style('stroke', '#fff')
                    .style('stroke-width', '3px')
                    .style('fill', 'url(#image-' + index + ')');

        // Text of the date
        /*
        svg.append('text')
            .attr('x', box.x * r + 5)
            .attr('y', box.y * r  + 15)
            .attr('fill', 'yellow')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(box.data.date);*/

        rect.on('click', function () {
            console.log(box.data);
            showImageDetail(box.data, keywords, box.origin);
            createGallery(images, keywords);
        });

        rect.on('mouseover', function () {
            rect.style('stroke', 'red');
        });

        rect.on('mouseout', function () {
            rect.style('stroke', '#fff');
        });

        index++;
    }

    console.log(index);

    /*
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const cw = dom.imageContainer.width();
    const ch = cw * h / w;
    canvas.width = cw * 2;
    canvas.height = ch * 2;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    ctx.scale(2, 2);
    const r = cw / w;
    ctx.lineWidth = 0.5;

    for (const box of images) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
        ctx.rect(box.x * r, box.y * r, box.w * r, box.h * r);
        ctx.fill();
        ctx.stroke();

        let img = new Image()
        img.onload = () => {
            ctx.drawImage(img, box.x * r, box.y * r, box.w * r, box.h * r);
            ctx.strokeStyle = '#fff';  // some color/style
            ctx.lineWidth = 3; 
            ctx.strokeRect(box.x * r, box.y * r, box.w * r, box.h * r);
        }
        img.data = box.data;
        img.src = box.src
    }*/

    return;
}

/**
 * Get all images dimensions
 * @param {*} points 
 */
function getAllDimensions (points)
{
    function getDim (src, data, originSrc) {

        return new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () => resolve({
                h: image.height,
                w: image.width,
                src: src,
                data: data,
                origin: originSrc
            });
            image.onerror = reject;
            image.src = src;
        });
    }

    return Promise.all(points).then( (points) => {
        var arr = [];
        points.forEach( (point) => {
            getDim(point.imageLeft, point, point.imageOriginalLeft).then( data => {
                arr.push(data);    
            }).catch(e => {});
            getDim(point.imageRight, point, point.imageOriginalRight).then( data => {
                arr.push(data);        
            }).catch(e => {});
        })
        return arr;
    });
}

/**
 * 
 * @param {*} keywords 
 * @param {*} streets 
 */
function prepareData (keywords, streets) 
{
    var data = [];
    var trips =  getAllTrips();

    trips.forEach( trip => {

        for (var i = 0, len = trip.keywords.length; i < len; ++i) {

            let streetname = getStreetname(trip.roadids[i]);

            if (streets.indexOf(streetname) !== -1) {
                if (hasKeywords(trip.keywords[i], keywords)) {
                    var item = {
                        date: trip.date,
                        narrative: trip.narratives[i],
                        point: trip.path[i],
                        street: streetname,
                        videoLName: trip.videoLNames[i],
                        videoRName: trip.videoRNames[i],
                        videoLTime: trip.videoLTimes[i],
                        videoRTime: trip.videoRTimes[i]
                    }
    
                    data.push(getDataItem(item));
                }   
            }     
        }

    });

    // Check existing keywords
    function hasKeywords (keywords, selectedKeywords) {
        return (selectedKeywords.some( 
            keyword => keywords.indexOf(keyword) === -1)
        ) ? false : true;
    }

    // Get data item
    function getDataItem (d) {
        return {
            date: d.date,
            street: d.street,
            imageLeft: getImagePath(d.videoLName, d.videoLTime),
            imageRight: getImagePath(d.videoRName, d.videoRTime),
            imageOriginalLeft: getImageRaw(d.videoLName, d.videoLTime),
            imageOriginalRight: getImageRaw(d.videoRName, d.videoRTime),
            narratives: d.narrative,
            location: d.point,
        }
    }

    function getImagePath (videoname, videotime) {
        let location = getCurrentLocationName();
        let tripid = videoname.split('.')[0];
        let image = tripid + '-' + videotime + '.jpg'
        return location + '/images/' + tripid + '/' + image;
    }

    function getImageRaw (videoname, videotime) {
        let location = getCurrentLocationName();
        let tripid = videoname.split('.')[0];
        let image = tripid + '-' + videotime + '.jpg'
        return location + '/images/' + tripid + '/' + image;
    }

    return data;
}


function showImageDetail (item, keywords, src) {

    locationLayer.clearLayers();
    dom.galleryDetails.css({ width: '40%' });
    dom.galleryImages.css({ width: '60%' });
    if (minimap) {
        resetMap(minimap);
    }
    // Create leaflet minimap 
    minimap = createMap('gallery-detail-map');
    resizeMap(minimap);
    // Add location to minimap with marker pulse icons
    let pulseIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: 'red',
        heartbeat: 1
    });
    // Add pulse icon to the marker
    let marker = L.marker(item.location, {
        icon: pulseIcon
    });

    locationLayer.addLayer(marker);
    addMapLayer(minimap, locationLayer);
    let bounds = locationLayer.getBounds();
    minimap.fitBounds(bounds);
    //autoFocus(minimap, locationLayer);

    // show image
    dom.detailImage.empty();
    let img = createImageElement(src, 'detail-img', '', '');
    dom.detailImage.append(img);

    dom.detailInfo.empty();
    let info = "<strong>Date:</strong> " + item.date + '<br>';
    info += "<strong>Street:</strong> " + item.street + '<br><br>';
    info += item.narratives;
    dom.detailInfo.html(info);

    var context = document.querySelector("#gallery-detail-info");
    var instance = new Mark(context);
    instance.mark(keywords);

    return;
}