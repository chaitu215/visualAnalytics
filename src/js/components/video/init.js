import {dom, addCurrentMinimapMarker, addOtherLocation} from '../ui';
import {layers, addMapLayer, getVideoMarker} from '../map';
import {addJSlider, updateJSlider} from './slider';
import {getCurrentLocationName, map, videoFlyingText, modes} from '../../main/geovisuals';
import {showCurrentWordCloud, displayTripEqualizer, calculateBearing, addCompass, initFlyingText} from '../component';
import {default as getStreetname} from '../utils/getStreetname';
import { preprocessEqualizerData, updateEqualizer, moveToCurrentSDP } from '../trips';

var currentIndex = 0;
export var currentPointIndex = 0;
export var showSdp = true;

export default function (trips) {
    // reset current index

    // Set left right video buttons
    setLeftRightButtons();
    // Set first trip to play video
    let trip = trips[0];
    // addVideo(trip, 0);
    dom.playButton.html('<i class="fa fa-play" aria-hidden="true"></i>&nbspPlay');
    dom.playButton.off().on('click', function (e) {
        if ( dom.playButton.innerHTML ==='<i class="fa fa-play" aria-hidden="true"></i>&nbspPlay'){
            dom.playButton.html('<i class="fa fa-pause" aria-hidden="true"></i>&nbspPause');
        } else {
            dom.playButton.html('<i class="fa fa-play" aria-hidden="true"></i>&nbspPlay');
        }
    });
    console.log(trip.narratives.findIndex(narrative => narrative!=="none"))
    dom.imageLeft.attr("src",`sample/images/${trip.id}-L/${trip.id}-L-${trip.narratives.findIndex(narrative => narrative!=="none")}.jpg`);
    dom.imageRight.attr("src",`sample/images/${trip.id}-R/${trip.id}-R-${trip.narratives.findIndex(narrative => narrative!=="none")}.jpg`);
//    dom.imageLeftData.attr("src",`sample/images/${trip.id}-L/${trip.id}-L-${trip.narratives.findIndex(narrative => narrative!=="none")}.jpg`);
    
    addJSlider(trip, 0);
}

export function addVideo(trip, index) {

    dom.playButton.html('<i class="fa fa-play" aria-hidden="true"></i>&nbspPlay');
    let videoLeftPlayer = compute(trip.videoLNames, trip.videoLTimes, index);

    let videoRightPlayer = compute(trip.videoRNames, trip.videoRTimes, index);

    let videoLeft = addLeft(videoLeftPlayer, trip);
    let videoRight = addRight(videoRightPlayer, trip);

    setEvents(videoLeft, videoRight, videoLeftPlayer[0], videoRightPlayer[0], trip);

    return;
}

function addLeft(playerLeft, trip) {
    // Remove video source
    let garbage = document.getElementById('video-left');
    // If this video has already exist.
    if (garbage) {
        garbage.pause();
        garbage.src="";
        garbage.load();
        $('#video-left').remove();
        //insight.video.playButton.html('<i class="fa fa fa-play" aria-hidden="true"></i>&nbspPlay');
    }

    dom.videoLeft.empty();
    // Create video element
    var video = document.createElement('video');
    video.id = 'video-left';
    video.className = 'video';
    var source = document.createElement('source');
    source.type = 'video/mp4';
    var url = '/video/' + getCurrentLocationName() + ',' + trip.id + ',' + playerLeft[0].videoname;
    source.src = url;
    video.append(source);
    dom.videoLeft.append(video);
    video.currentTime = playerLeft[0].starttime;
    return video;
}

function addRight(playerLeft, trip) {
    // Remove video source
    let garbage = document.getElementById('video-right');
    // If this video has already exist.
    if (garbage) {
        garbage.pause();
        garbage.src="";
        garbage.load();
        $('#video-right').remove();
        //insight.video.playButton.html('<i class="fa fa fa-play" aria-hidden="true"></i>&nbspPlay');
    }

    dom.videoRight.empty();

    // Create video element
    var video = document.createElement('video');
    video.id = 'video-right';
    video.className = 'video';
    video.muted = true;
    var source = document.createElement('source');
    source.type = 'video/mp4';
    var url = '/video/' + getCurrentLocationName() + ',' + trip.id + ',' + playerLeft[0].videoname;
    source.src = url;
    video.append(source);

    dom.videoRight.append(video);

    video.currentTime = playerLeft[0].starttime;
    return video;
}

function compute(videoNames, videoTimes, startingIndex) {

    function checkExisting(arr, videoname) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].videoname === videoname) {
                return true;
            }
        }
        return false;
    }

    function updateTimeStamp(arr, videoname, videotime) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].videoname === videoname) {

                if (videotime < arr[i].starttime) {
                    arr[i].starttime = videotime;
                }

                if (videotime > arr[i].endtime) {
                    arr[i].endtime = videotime;
                }

            }
        }
    }

    // Compute video data begining at starting index
    var tempName;
    var videoList = [];
    for (var i = startingIndex; i < videoNames.length; i++) {
        if (videoNames[i] == 'none' && videoNames != tempName) {
            tempName = videoNames[i];
        } else {
            if (checkExisting(videoList, videoNames[i])) {

                updateTimeStamp(videoList, videoNames[i], videoTimes[i], i);

            } else {
                // Initialize it as start time.
                var video = {
                    videoname: videoNames[i],
                    starttime: videoTimes[i],
                    endtime: 0,
                }
                videoList.push(video);
            }
        }
    }
    return videoList;
}

function setLeftRightButtons () {
    dom.leftVideoButton.off().on('click', function (e) {
        dom.videoLeft.css({
            'display': 'block',
            'width': 'calc(100%)'
        });
        dom.videoMiddle.css({
            'display': 'none',
            'width': '0%'
        });
        dom.videoRight.css({
            'display': 'none',
            'width': '100%'
        });
        dom.leftrightVideoButton.css({
            "background": "#525252",
            "color": "#fff"
        });
        dom.leftVideoButton.css({
            "background": "#ffeda0",
            "color": "#000",
            "border": "1px solid #000"
        }); // orange
        dom.rightVideoButton.css({
            "background": "#525252",
            "color": "#fff"
        });
    });

    dom.rightVideoButton.off().on('click', function (e) {
        dom.videoLeft.css({
            'display': 'none',
            'width': '100%'
        });
        dom.videoMiddle.css({
            'display': 'none',
            'width': '0%'
        });
        dom.videoRight.css({
            'display': 'block',
            'width': 'calc(100%)'
        });
        dom.leftrightVideoButton.css({
            "background": "#525252",
            "color": "#fff"
        });
        dom.leftVideoButton.css({
            "background": "#525252",
            "color": "#fff"
        });
        dom.rightVideoButton.css({
            "background": "#ffeda0", //ffeda0
            "color": "#000",
            "border": "1px solid #000"
        });
    });

    dom.leftrightVideoButton.off().on('click', function (e) {
        dom.videoLeft.css({
            'display': 'block',
            'width': 'calc(49%)'
        });
        dom.videoMiddle.css({
            'display': 'block',
            'width': '2%'
        });
        dom.videoRight.css({
            'display': 'block',
            'width': 'calc(49%)'
        });
        dom.leftrightVideoButton.css({
            "background": "#ffeda0",
            "color": "#000",
            "border": "1px solid #000"
        });
        dom.leftVideoButton.css({
            "background": "#525252",
            "color": "#fff"
        });
        dom.rightVideoButton.css({
            "background": "#525252",
            "color": "#fff"
        });
    });
    return;
}

function setEvents(videoLeft, videoRight, playerLeft, playerRight, trip)
{
    dom.playButton.off().on('click', function () {
        if (videoLeft.paused == true && videoLeft.currentTime <= playerLeft.endtime && videoRight.paused == true && videoRight.currentTime <= playerRight.endtime) {

            videoLeft.play();
            videoRight.play();
            dom.playButton.html('<i class="fa fa-pause" aria-hidden="true"></i>&nbspPause');
        } else {
            videoLeft.pause();
            videoRight.pause();
            dom.playButton.html('<i class="fa fa-play" aria-hidden="true"></i>&nbspPlay');
        }
    });

    $(videoLeft).off().on('loadedmetadata', function () {
        videoLeft.currentTime = playerLeft.starttime;
    });

    $(videoRight).off().on('loadedmetadata', function () {
        videoRight.currentTime = playerRight.starttime;
    });

    // Stop video right during video time update
    $(videoRight).off().on('timeupdate', function () {
        if (videoRight.currentTime >= playerRight.endtime) {
            videoRight.pause();
        }
    });

    let temp = -1;
    let tempClosest = -1;
    $(videoLeft).off().on('timeupdate', function () {
        if (videoLeft.currentTime >= playerLeft.endtime) {
            videoLeft.pause();
        } else {
            // let value = (100 / videoLeft.duration) * videoLeft.currentTime;
            // important
            
            let pointIndex = getIndex(parseInt(videoLeft.currentTime), playerLeft.videoname, trip);

            currentPointIndex = pointIndex;

            // Add all sdp point to the arrays
            let arrid = [];
            $('#sdp').children('.point-container').each(function() {
                    var id = this.id.split('-')[1];
                    arrid.push(id);
            });


            if (temp != pointIndex) {


                //d3.selectAll('#video-player-container span').remove();
                //console.log(videoFlyingText);
                if (videoFlyingText && trip.keywords[pointIndex].length != 0) {
                    let keywords = trip.keywords[pointIndex];
                    let list = [];
                    keywords.forEach( (word) => {
                        let pos = list.indexOf(word);
                        if (pos == -1) {
                            // update flying text
                            // initialize flying text
                        initFlyingText(word);
                            list.push(word);
                        }
                    });
                }

                var closestIndex = getclosestIndex(pointIndex, arrid);
                // Update all trip informations.
                /*
                $('#trip-detail-street').html(getStreetname(trip.roadids[pointIndex]));
                $('#video-date').html(trip.date);*/

                // Set video marker of the current map
                //setVideoMarker(trip.path[pointIndex], trip.path[pointIndex + 1]);
                // Add current marker to all minimap
                addCurrentMinimapMarker(trip.path[pointIndex]);
                //addOtherLocation(trip.path[pointIndex]);
                
                // Equalizer
                var data = preprocessEqualizerData(trip.path[pointIndex], trip.index);
                updateEqualizer(data);

                // Display bearing angle of current location

                if (pointIndex < trip.path.length && pointIndex >= 0) {
                    var bearing = calculateBearing(trip.path[pointIndex], trip.path[pointIndex + 1]);
                    addCompass(dom.videoLeft, dom.videoRight, bearing);
                }

                


                //displayTripEqualizer(trip.path[pointIndex], trip.index);

                // Show current wordcloud of nearest narrative point
                if (closestIndex != tempClosest) {
                    // Display current wordcloud when video time update
                    closestIndex = (!closestIndex) ? 0 : closestIndex;
                    moveToCurrentSDP(closestIndex);
                    //console.log(trip.keywords[closestIndex]);
                    //showCurrentWordCloud([trip.keywords[closestIndex]]);
                }

                // Need to fix this
                //currentIndex = pointIndex;
                // For showing North and south
                /*
                let bearing = calculateBearing(trip.path[pointIndex], trip.path[pointIndex + 1]);*/

                /*
                $('#video-player-left').find('.left-compass').empty();
                $('#video-player-right').find('.right-compass').empty();
                addCompass($('#video-player-left'), $('#video-player-right'), bearing);*/

                updateJSlider(trip, pointIndex);

                setVideoMarker(trip.path[pointIndex], trip.path[pointIndex + 1]);
                temp = pointIndex;
                tempClosest = closestIndex;

                //chartjs();
            }
        }
    });
    return;
}

function getclosestIndex(num, arr) {
    var curr = arr[0];
    var diff = Math.abs (num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs (num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;
}

//console.log("tripout",trip)
function getIndex(currenttime, videoname, trip) {
    for (let i = currentIndex; i < trip.videoLTimes.length; ++i) {
        if (trip.videoLNames[i] == videoname && trip.videoLTimes[i] == currenttime) {
            return i;
        }
    }
    return;
}

/**
 * set movable video marker in circle
 * @param {array} point1 array of latitude and longitude
 * @param {*} point2 
 */
export function setVideoMarker (point1, point2)
{
    // clear video marker layer
    layers.videoMarker.clearLayers();
    // get latitude and logitude
    var circleMarker = getVideoMarker(point1, '#000', '#4cff00', 1, {});
    // add circle marker to map layer
    layers.videoMarker.addLayer(circleMarker);
    addMapLayer(map.leaflet, layers.videoMarker);
    return;
}

// Set video marker icon
// Add calculate bearing
/*
export function setVideoMarker (point1, point2) {
    //console.log(latlng);
    layers.videoMarker.clearLayers();
    // Create latitude and longitude values
    var latitude1 = point1[0],
        longitude1 = point1[1];

    var latitude2 = point2[0],
        longitude2 = point2[1];

    var p1 = [longitude1, latitude1], p2 = [longitude2, latitude2];
    // Set final bearing for turning a car marker
    var bearing = turf.rhumbBearing(p1, p2, { final: true });

    var carmarker = getCarMarker([latitude1, longitude1], bearing);
    layers.videoMarker.addLayer(carmarker);
    addMapLayer(map.leaflet, layers.videoMarker);
    return;
}*/