import { getKeywordCollections } from './keywords';
import { groupBy } from './create';
import { default as dom } from './ui-element';
import { default as getData } from './data';
import { createImageElement, resetMap, createMap, resizeMap, autoFocus, addMapLayer} from '../component';
import {default as Mark} from 'mark.js';
import { getCurrentLocationName } from '../../main/geovisuals';
import { default as showBuilding } from './image-views/building'

import potpack from 'potpack';
//import { default as merge } from './image-processing/merge';

export var minimap = undefined;
export var locationLayer = L.featureGroup();

export default function (keywords) {

    reset();

    // let keywords = getKeywordCollections();
    // let data = getData(keywords);
    dom.imageContainer.empty();
    let location = getCurrentLocationName();

    showBuilding(keywords);


    /*
    let dimensions = [];
    for (let i = 0; i < 2400; ++i) {
        var image = '1060814-L-' + i + '.jpg';
        var imagePath = location + '/contours/' + image;
        getImageDimensions(imagePath).then( data => {
            dimensions.push(data);
        }).catch(e => {

        });
    }

    let canvas = $('<canvas/>', {
        id: 'canvas'
    }).css({
        border: '1px solid #ccc', 
        'margin-bottom': '5px'
    });
    dom.imageContainer.append(canvas);

    setTimeout(() => {
        const {w, h, fill} = potpack(dimensions);
        console.log(dimensions);


        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const cw = 580;
        const ch = cw * h / w;
        canvas.width = cw * 2;
        canvas.height = ch * 2;
        canvas.style.width = cw + 'px';
        canvas.style.height = ch + 'px';
        ctx.scale(2, 2);
        const r = cw / w;
        ctx.lineWidth = 0.5;

        for (const box of dimensions) {
            ctx.beginPath();
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
            ctx.rect(box.x * r, box.y * r, box.w * r, box.h * r);
            ctx.fill();
            ctx.stroke();

            let img = new Image()
            img.onload = () => {
                ctx.drawImage(img, box.x * r, box.y * r, box.w * r, box.h * r);
                ctx.strokeStyle = '#fff';  // some color/style
                ctx.lineWidth = 2; 
                ctx.strokeRect(box.x * r, box.y * r, box.w * r, box.h * r);
            }
            img.src = box.src
        }

        
        canvas.onmousemove = function (e) {

            var rect = this.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;

            ctx.clearRect(0, 0, canvas.width, canvas.height); 

            for (const box of dimensions) {
                ctx.beginPath();
                ctx.rect(box.x * r, box.y * r, box.w * r, box.h * r);
                ctx.fillStyle = ctx.isPointInPath(x, y) ? 'blue' : 'yellow';
                ctx.fill();
            }
        }

    }, 3000);*/

    
    

    /*
    data.forEach( item => {
    });
    */

    /*
    var s = "Selected Keywords:";
    keywords.forEach( word => {
        s += "   <strong>" + word + "</strong>";
    });
    $('#gallery-keywords').html(s);
    */
    
    /*createThumbnail(data);*/
    return;
}

function getImageDimensions (src){
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve({
            h: img.height,
            w: img.width,
            src: src
        });
        img.onerror = reject
        img.src = src
    });
}

/*
function getImageDimensions ()
{
    var result = [];
    let location = getCurrentLocationName();
    for (let i = 0; i < 2400; ++i) {
        var image = '1060814-L-' + i + '.jpg';
        var imagePath = location + '/contours/' + image;
        var img = new Image();
        img.onload = function () {
            var dim = {
                index: i,
                w: this.width,
                h: this.height
            }

            result.push(dim);
        }
        img.src = imagePath;
    }

    return result;
}*/

function reset () {
    dom.galleryImages.css({ width: '100%' });
    dom.galleryDetails.css({ width: '0%' });
    return;
}

function createThumbnail (data) {
    dom.imageContainer.empty();
    data.forEach(item => {
        let left = createImageElement(item.imageLeft, 'gallery-img', '', '');
        let right = createImageElement(item.imageRight, 'gallery-img', '', '');
        dom.imageContainer.append(left).append(right);

        left.addEventListener('click', () => {
            showImageDetail(item, 'left');
            $('.gallery-img').removeClass('selected');
            left.classList.add("selected");
        });

        right.addEventListener('click', () => {
            showImageDetail(item, 'right');
            $('.gallery-img').removeClass('selected');
            right.classList.add("selected");
        });
    });
    return;
}

function showImageDetail (item, leftright) {
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
    autoFocus(minimap, locationLayer);

    // show image
    dom.detailImage.empty();
    if (leftright == 'left') {
        let img = createImageElement(item.imageLeft, 'detail-img', '', '');
        dom.detailImage.append(img);
    } else {
        let img = createImageElement(item.imageRight, 'detail-img', '', '');
        dom.detailImage.append(img);
    }

    dom.detailInfo.empty();
    let info = "<strong>Date:</strong> " + item.date + '<br>';
    info += "<strong>Street:</strong> " + item.street + '<br><br>';
    info += item.narratives;
    dom.detailInfo.html(info);

    var context = document.querySelector("#gallery-detail-info");
    var instance = new Mark(context);
    instance.mark(getKeywordCollections());

    return;
}