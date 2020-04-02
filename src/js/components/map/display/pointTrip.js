import {default as layers} from '../layers';
import {addMapLayer, getCircleMarker, getPolyline} from '../../map';
import {addVideo} from '../../video/init';
import {getImagePath, createImageElement} from '../../utils';
/**
 * 
 * @param {*} map 
 * @param {*} trips 
 */
export default function (map, trips) {
    layers.pointTrip.clearLayers();

    trips.forEach( function (trip) {
        for (let i = 0, len = trip.narratives.length; i < len; ++i) {
            var narrative = trip.narratives[i];
            // Check existing narrative
            if (narrative !== "none") {
                // Create point
                var point = new L.LatLng(trip.path[i][0], trip.path[i][1]);
                // Create attribute attach to marker
                var attr = {
                    index: i,
                    tripid: trip.index,
                    videoLName: trip.videoLNames[i],
                    videoRName: trip.videoRNames[i],
                    videoLTime: trip.videoLTimes[i],
                    videoRTime: trip.videoRTimes[i],
                }
                // #08306b #fc4e2a
                var marker = getCircleMarker(point, '#000', '#238443', 0.8, attr);

                let pathLeft = getImagePath(    trip.videoLNames[i], 
                                                trip.videoLTimes[i]);
                let pathRight = getImagePath(    trip.videoRNames[i], 
                                                trip.videoRTimes[i]);

                // Create image elements
                let imgLeft = createImageElement(pathLeft, 'hovertrip-image', '', '');
                let imgRight = createImageElement(pathRight, 'hovertrip-image', '', '');

                // Add image to marker
                let container = getTooltipContainer(imgLeft, imgRight);

                var tooltipStr = container.prop('outerHTML') + "<br>" + '<strong><font color="#225ea8">' + trip.date + ' - ' + trip.times[i] + '</font></strong><div style="width: 100%; height: 50px;overflow-y: auto;">' + narrative + '</div>';

                //<img src="img_girl.jpg" alt="Girl in a jacket">

                // Bind tooltip information
                marker.bindTooltip(tooltipStr, {direction: 'auto', className: 'currentTripTooltip'});

                
                marker.on('click', function () {
                    addVideo(trip, i);
                });
                //layers.narrativeMarkers.addLayer(marker);
                layers.pointTrip.addLayer(marker);
            }
        }
    });

    addMapLayer(map, layers.pointTrip);
    
    //setClusterEvents(map);
    //layers.narrativeMarkers.fire('animationend');
    //layers.pointTrip.bringToFront();
    return;
}

/**
 * Create tooltip container
 */
function getTooltipContainer (imageLeft, imageRight) {

    let container = $('<div/>').css({
        width: '100%',
        height: '80px'
    });

    let left = $('<div/>').css({
        width: '50%',
        height: '100%',
        float: 'left'
    });
    let right = $('<div/>').css({
        width: '50%',
        height: '100%',
        float: 'left'
    });

    left.append(imageLeft);
    right.append(imageRight);

    return container.append(left).append(right);
}

// Create static cluster convexhull
// Look to this fiddle: https://jsfiddle.net/mad__97/3v7hd2vx/211/
/*
function setClusterEvents (map) {

    layers.narrativeMarkers.on('animationend', function () {
        layers.convexHull.clearLayers();
        layers.narrativeMarkers._featureGroup.eachLayer( function (layer) {
            if (layer instanceof L.MarkerCluster && layer.getChildCount() > 2) {
                
                var markers = layer.getAllChildMarkers();

                // Generate point set
                let pointset = [];
                // Get latitude and longitude of each marker
                markers.forEach( function (marker) {
                    let latlng = marker.getLatLng();
                    let point = [latlng.lat, latlng.lng];
                    pointset.push(point);
                });
                
                layers.convexHull.addLayer(L.polygon(layer.getConvexHull(), {
                    fillColor: '#a6d96a',
                    color: '#000',
                    fillOpacity: 0.8,
                    weight: 0.5
                }));
            }
        });
        addMapLayer(map, layers.convexHull);
    });
}
*/