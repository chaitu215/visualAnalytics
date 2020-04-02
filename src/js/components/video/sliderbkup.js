import { dom, addCurrentMinimapMarker, addOtherLocation } from '../ui';
import { addVideo, setVideoMarker } from './init';
import { updateEqualizer, preprocessEqualizerData, getStreetname, showCurrentWordCloud, layers, getVideoMarker, getImagePath, createImageElement } from '../component';
import { addMapLayer } from '../map';
import { getCurrentMap, modes } from '../../main/geovisuals';
import { draw_flag_keywords } from './flagKeywords';

export var tmpIndex = 0;
export var switch_height = false;


export function addJSlider(trip, currentIndex) {

    let min = 0;
    let max = trip.path.length - 1;
    // get current map
    var map = getCurrentMap();

    //let areaMarker = new L.featureGroup(); 

    $('.video-player-controlArea').remove();

    //videoSlider.remove($('.video-player-controlArea'));
    let area = $("<div/>", {
        class: 'video-player-controlArea'
    }).css({
        width: '100%'
    });
    area.appendTo(dom.videoSlider);

    var norm = function (value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    };

    draw_flag_keywords(area, trip);

    /*
    let width = area.width();


    // Initialize heatmap captions
    let seconds = 0;
    let scores = 0;
    let area_keywords = {};
    let left = 0;
    // Create narrative area
    let maxSeconds = 100;
    // Aggregate trip time baseon max seconds
    let group = trip.times.length / maxSeconds;
    // Get area width of each group
    let area_width = width / group;

    for (let i = 0; i< trip.times.length; ++i) {
        // Create heatmap area chart (preprocessing)
        if (seconds < maxSeconds) {
            if (trip.keywords[i].length > 0) {
                trip.keywords[i].forEach( keyword => {
                    if (keyword in area_keywords) {
                        area_keywords[keyword]++;
                    } else {
                        area_keywords[keyword] = 1;
                    }
                });
                // Adding score if narrative was found
                ++scores;
            } 
            // Increment starting time
            ++seconds;
        } else {

            let narrative_area = $('<div/>').css({
                class: 'video-narrative-area',
                width: area_width,
                height: '100%',
                background: get_area_color(scores),
                position: 'absolute',
                top: '-20px',//(switch_height) ? '-20px' : '-40px',
                left: left,
                cursor: 'pointer',
                color: '#000',
                'font-size': '12px',
                'text-align': 'center'
            });

            //switch_height = !switch_height;

            if (scores >= 1 && scores <=10) {
                let key = Object.keys(area_keywords).reduce((a, b) => area_keywords[a] > area_keywords[b] ? a : b);
                narrative_area.html(key);
                narrative_area.css({ 'z-index': '5000' });

                
                narrative_area.hover( () => {
                    narrative_area.css({ height: '130%', top: '-25px' });
                }, () => {
                    narrative_area.css({ height: '100%', top: '-20px' });
                });
            }

            area.append(narrative_area);
            // Reset every counter
            seconds = 0;
            scores = 0;
            area_keywords = {};
            left += area_width;
        }
    }*/

    // Create narrative area
    for (let i = 0; i < trip.times.length; ++i) {

        if (trip.narratives[i] != "none") {
            let clickArea = $("<div/>", {
                class: "video-area"
            });
            let v = norm(i, [min, max], [0, 100]);
            clickArea.css("left", v + "%");
            clickArea.hover(function () {

                clickArea.css({ background: '#b2182b' });
                // clear slider marker
                layers.videoPlayer.sliderMarker.clearLayers();


                var sliderMarker = getVideoMarker(trip.path[i], '#225ea8', '#c7e9b4', 1, {});

                let pathLeft = getImagePath(trip.videoLNames[i], trip.videoLTimes[i]);
                let pathRight = getImagePath(trip.videoRNames[i], trip.videoRTimes[i]);

                let leftImage = createImageElement(pathLeft, 'hovertrip-image', '', '');
                let rightImage = createImageElement(pathRight, 'hovertrip-image', '', '');

                let container = getTooltipContainer(leftImage, rightImage);
                var tooltipStr = container.prop('outerHTML') + "<br>" + '<strong><font color="#225ea8">' + trip.date + ' - ' + trip.times[i] + '</font></strong><div style="width: 100%; height: 50px;overflow-y: auto;">' + trip.narratives[i] + '</div>';

                sliderMarker.bindTooltip(tooltipStr, {
                    direction: 'auto',
                    className: 'currentTripTooltip',
                    permanent: true
                });

                layers.videoPlayer.sliderMarker.addLayer(sliderMarker);
                // pan latitude and longitude to current map
                map.panTo(new L.LatLng(trip.path[i][0], trip.path[i][1]));

            }, function () {
                clickArea.css({ background: '#000000' });
                // clear slider marker
                layers.videoPlayer.sliderMarker.clearLayers();
            });
            area.append(clickArea);
        }
    }

    addMapLayer(map, layers.videoPlayer.sliderMarker);

    //videoSlider.slider();
    dom.videoSlider.slider({
        create: function () {
            let index = $(this).slider("value");
            dom.timeHandle.text(trip.times[index]);
            addVideo(trip, index);
        },
        min: min,
        max: max,
        step: 1,
        value: currentIndex,
        slide: function (event, ui) {
            let index = ui.value;
            console.log(trip.times[index])
            dom.timeHandle.text(trip.times[index]);
            // Add person marker to the current trip minimap
            addCurrentMinimapMarker(trip.path[index]);
            // Add current marker to minimap
            addOtherLocation(trip.path[index]);
            // Set video marker to the main map
            setVideoMarker(trip.path[index], trip.path[index + 1]);
            //addVideo(trip, index);
            updateTripInfo(trip, index);
            updateNarrative(trip, index);
            let data = preprocessEqualizerData(trip.path[index], trip.index);
            updateEqualizer(data);
        },
        stop: function (event, ui) {
            let index = ui.value;
            dom.timeHandle.text(trip.times[index]);
            // No need to update other marker
            // Update narratives
            addVideo(trip, index);
        }
    });

    return;
}

export function updateJSlider(trip, index) {
    console.log("trip", trip)
    dom.videoSlider.slider("value", index);
    if (trip.narratives[index] !== "none") {
        //trip.narratives[index]
        console.log("trip.narratives[index]", trip.narratives[index])
        console.log("trip", trip);

        dom.imageLeft.attr("src", `sample/images/${trip.id}-L/${trip.id}-L-${index}.jpg`);
        dom.imageRight.attr("src", `sample/images/${trip.id}-R/${trip.id}-R-${index}.jpg`);
        //dom.imageLeftData.attr("src",`sample/images/${trip.id}-L/${trip.id}-L-${index}.jpg`);
        //dom.imageLeftData.append("src",`sample/jsondata/${trip.id}-L/${trip.id}-L-${index}.jpg/dummy.json`);
        //console.log("file",`asset/sample/datajson/${trip.id}-L/${trip.id}-L-${index}.jpg/dummy.json`)
        var a = "../../../../asset/sample/datajson/" + trip.id + "-L/" + trip.id + "-L-" + index + ".jpg/dummy.json"
        console.log("a", a)
        //var json = require("../../../../asset/sample/datajson/02-06-15-L/02-06-15-L-1.jpg/dummy.json")
        //console.log("json",json)
        var dataLeft, dataRight = [];
        if (index > 0) {
            dataLeft = require("../../../../asset/sample/datajson/" + trip.id + "-L/" + trip.id + "-L-" + index + ".jpg/dummy.json")
            console.log("dataLeft", dataLeft);
            dataRight = require("../../../../asset/sample/datajson/" + trip.id + "-R/" + trip.id + "-R-" + index + ".jpg/dummy.json")
        }
        console.log("dataLeft", dataLeft)
        console.log(dataLeft.sidewalk)
        console.log(dataLeft.road)
        console.log(dataLeft.building)
        document.getElementById("data-player-left").innerHTML =
            `
        <html>
        <div id='Chart' style="width:80%;height:80%">
        </div>
        </html> 
        `

        document.getElementById("data-player-right").innerHTML =
            `
        <html>
           <div id="piechart" style="width: 100%; height: 100%;"></div>
        </html>
        `

        console.log('------ left -----')
        draw(dataLeft.sidewalk, dataLeft.road, dataLeft.building, dataLeft.wall,
            dataLeft.fence, dataLeft.pole, dataLeft.vegetation, dataLeft.terrain,
            dataLeft.sky, dataLeft.person, dataLeft.rider, dataLeft.car,
            dataLeft.truck, dataLeft.bus, dataLeft.train, dataLeft.motocycle, dataLeft);
        console.log("-------right-------")
        drawRight(dataRight.sky, dataRight.road, dataRight.car, dataRight.building);

        //console.log("draw graph",drawgraph())
        //drawgraph();
        //dom.imageRightData.src("src",data);
    }
    // "asset/sample/images/"
    //document.getElementById(imageLeftData).innerHTML = data
    console.log("trip times", trip.times[index])
    dom.timeHandle.text(trip.times[index]);
    updateTripInfo(trip, index);
    updateNarrative(trip, index);

    return;
}

//

function draw(sidewalk, road, building, wall, fence, pole, vegetation, terrain,
    sky, person, rider, car, truck, bus, train, motocycle, dataLeft) {

    var data = {
        "data": [{
            "road": road,
            "sidewalk": sidewalk,
            "building": building,
            "wall": wall,
            "fence": fence,
            "pole": pole,
            // "traffic light": traffic light,
            // "traffic sign": 0.07691936728395062
            "vegetation": vegetation,
            "terrain": terrain,
            "sky": sky,
            "person": person,
            "rider": rider,
            "car": car,
            "truck": truck,
            "bus": bus,
            "train": train,
            "motocycle": motocycle,
            // "bicycle": bicycle
        }]
    }

    var newData = [];
    for (var key in data.data[0]) {

        var thisData = {
            "Name": key,
            "Value": data.data[0][key]
        }
        newData.push(thisData)
    }

    var width = 360;
    var height = 100;
    var outradius = Math.min(width, height) / 2;
    var inradius = outradius / 1.25;

    var color = d3.scale.category10();

    var svg = d3.select('#Chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
    var arc = d3.svg.arc()
        .outerRadius(outradius)
        .innerRadius(inradius);
    var pie = d3.layout.pie()
        .value(function (d, i) {

            return d.Value;
        })
        .sort(null);

    var path = svg.selectAll('path')
        .data(pie(newData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d, i) {
            return color(d.data.Name);
        });

    // legends




}
// fun end 

// chart Right

function drawRight(sky, road, car, building) {
    console.log("draw Right")
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);



    function drawChart() {


        var data = google.visualization.arrayToDataTable([
            ['Object', 'Visual pecentage'],
            ['Sky', sky],
            ['Road', road],
            ['Wall', car],
            ['Building', building]
        ]);

        var options = {
            title: 'Visual Outdoor Analytics'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }


}



export function updateTripInfo(trip, index) {
    console.log(trip.times[index])
    dom.currentTripDate.html(trip.date);
    dom.currentTripTime.html(trip.times[index]);
    dom.currentTripStreet.html(getStreetname(trip.roadids[index]));
    return;
}

export function updateNarrative(trip, index) {

    var backwardStep = 0; var backwardText = "none"; var backwardKeywords = [];
    var forwardStep = 0; var forwardText = "none"; var forwardKeywords = [];

    // Get forward
    var i = index;
    while (forwardText == "none" && i < trip.narratives.length) {
        if (trip.narratives[i] != "none") {
            forwardText = trip.narratives[i];
            forwardKeywords = trip.keywords[i];
        } else {
            i++;
            forwardStep++;
        }
        console.log("trip", trip);
        console.log("trip.narratives[i]", trip.narratives[i])
    }


    var j = index;
    while (backwardText == "none" && j >= 0) {
        if (trip.narratives[j] != "none") {
            backwardText = trip.narratives[j];
            backwardKeywords = trip.keywords[j];
        } else {
            j--;
            backwardStep++;
        }
    }

    if (forwardStep <= backwardStep) {
        // update narrative
        dom.currentTripNarrative.html(forwardText);
        // update wordcloud
        if (tmpIndex !== i) {
            //showCurrentWordCloud([forwardKeywords]);
            tmpIndex = i;
        }

    } else {
        // update narrative
        dom.currentTripNarrative.html(backwardText);
        // update wordcloud
        if (tmpIndex !== j) {
            //showCurrentWordCloud([backwardKeywords]);
            tmpIndex = j;
        }
    }

    return;
}

/**
 * Create tooltip container
 */
function getTooltipContainer(imageLeft, imageRight, imageLeftData, imageRightData) {

    let container = $('<div/>').css({
        width: '100%',
        height: '80%'
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

    // testdata - krish
    let leftdata = $('<div/>').css({
        width: '50%',
        height: '100%',
        float: 'left'
    });
    let rightdata = $('<div/>').css({
        width: '50%',
        height: '100%',
        float: 'left'
    });


    leftdata.append(imageLeftData);
    rightdata.append(imageRightData);
    // krish

    left.append(imageLeft);
    right.append(imageRight);

    return container.append(left).append(right).append(leftdata).append(rightdata);
}

// Create sdps area over the slider bar
function add_slider_narratives(trip) {

}

// Get color base on the scoring
function get_area_color(d) {
    /* Green shade
    return  d > 7  ? '#00441b' :
            d > 6  ? '#006d2c' :
            d > 5  ? '#238b45' :
            d > 4  ? '#41ab5d' :
            d > 3  ? '#74c476' :
            d > 2  ? '#a1d99b' :
            d > 1  ? '#c7e9c0' :
            d > 0   ? '#e5f5e0' : '#f7fcf5';
    */

    /* Pink shade
    return  d > 5 ? '#fcbba1' :
            d > 3 ? '#fee0d2' :
            d > 1 ? '#fff5f0' : '#f0f0f0'; */

    return d >= 50 ? '#2c7fb8' :
        d >= 30 ? '#41b6c4' :
            d >= 20 ? '#7fcdbb' :
                d >= 10 ? '#c7e9b4' : '#ffffcc';
}

