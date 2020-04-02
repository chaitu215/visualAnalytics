import { default as getNearestPoint } from '../utils/nearestPoint';
import {getAllTrips} from '../../../main/geovisuals';
import {dom, showEqualizerMinimap} from '../../component';

export var Equalizer = undefined;

/**
 * Drawing a vertical barchart with equalizer like
 * @param {*} point - current location [lat, lng]
 * @param {*} tripIndex - current trip index
 */
export default function (point, tripIndex) {
    // Clear current equalizer container
    dom.equalizer.empty();
    // Hide minimap
    //dom.equalizer.css({ height: '60%'});
    $('#equalizer-minimap').hide();

    var data = preprocessEqualizerData(point, tripIndex);
    Equalizer = initEqualizer(data);
    //console.log(data);
    updateEqualizer(data);
    return;
}

/**
 * Compute dataset for drawing a equalizer
 * @param {*} point - current point
 * @param {*} tripIndex - current trip index
 */
function computeDataset (point, tripIndex) {

    let data = [];
    let trips = getAllTrips();
    // Create maxDistance for current trip
    let minDistance = Infinity, maxDistance = 0;
    // Find nearest point of all current trips
    for (let i = 0, len = trips.length; i < len; ++i) {
        let trip = trips[i];
        if (trip.index !== tripIndex) {
            // Find nearest point on other trips.
            let trajectory = getTurfLineString(trip.path);
            // Create a turf point
            let currentPoint = turf.point([point[1], point[0]]);
            let nearest = getNearestPoint(currentPoint, trajectory);
            // Predefine attributes
            let distance = nearest.properties.dist;
            let pointIndex = nearest.properties.index;
            let latitude = nearest.geometry.coordinates[1];
            let longitude = nearest.geometry.coordinates[0];

            // Create trip object 
            let tripObject = {
                index: trip.index,
                date: trip.date,
                pointIndex: pointIndex,
                originalPoint: point,
                point: [latitude, longitude],
                trip: trip, // use to pass to create minimap
                distance: distance,
                features: nearest,
                active: false
            }
            data.push(tripObject);
            // Update max distance
            if (distance < minDistance) minDistance = distance; 
            if (distance > maxDistance) maxDistance = distance;
        }
    }

    // Construct the graph
    data.push(getCurrentTrip(trips, tripIndex, minDistance))

    // Get turf linestring from current trajectory
    function getTurfLineString (trajectory) {
        let geoJsonLine = [];
        // Swap latitude and longitude of every points
        trajectory.forEach ( point => {
            geoJsonLine.push([point[1], point[0]]);
        });

        return turf.lineString(geoJsonLine);
    }

    // We set current trip with minimum distance
    function getCurrentTrip (trips, index, distance) {
        for (let i = 0, len = trips.length; i < len; ++i) {
            let trip = trips[i];
            if (trip.index === index ) {
                return {
                    index: trip.index,
                    date: trip.date,
                    point: point,
                    trip: trip, // use to pass to create minimap
                    distance: distance,
                    features: {},
                    active: true
                }
            }
        }
    }

    data = normalizeDistance(data, minDistance, maxDistance);
    return data;
}

/**
 * Convert minimum distance to maximum value
 * @param {*} data 
 */
function normalizeDistance (trips, min, max) {

    // Map distance to a specific value percentage
    trips.forEach( trip => {
        trip['value'] = normalize(trip.distance, [min, max], [100, 0]);
    });

    function normalize (value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    return trips;
}

/**
 * 
 * @param {*} a 
 * @param {*} b 
 */
function sortByDateAscending (a, b) 
{
    return new Date(a.date) - new Date(b.date);
}

/**
 * 
 * @param {*} point 
 * @param {*} tripIndex 
 */
function initEqualizer (data)
{
    let container = dom.equalizer;

    let barHeight = 18;

    // Specify dimension of the visualization
    let margin = {top: 0, right: 0, bottom: 0, left: 0};
    let width = container.width() - margin.left - margin.right;
    // Dynamic height
    let height = (barHeight * data.length + 10) - margin.top - margin.bottom;

    var barchart = d3.select('#' + container.attr('id'))
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

    barchart.attr("transform", "translate(0, 10)");
    
    var slicePattern = 20;
    /*
    var color1 = ['#800026','#bd0026','#e31a1c','#fc4e2a','#fd8d3c','#feb24c','#fed976','#ffeda0','#ffffcc','#ffffcc','#ffffe5',"#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"];*/

    var color1 = ['#004529','#006837','#238443','#41ab5d','#78c679','#addd8e','#d9f0a3','#f7fcb9','#ffffe5','#ffffe5','#ffffcc',"#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"];

    //var color1 = ['#fdae61'];


    // This will create a sliding pattern for equalizer
    
    var pattern = barchart.append('svg:defs')
                    .append('svg:pattern')
                    .attr("width", width)
                    .attr("height", barHeight)
                    .attr("id", "myPattern")
                    .attr("patternUnits","userSpaceOnUse");

    var pattern2 = barchart.append('svg:defs')
                    .append('svg:pattern')
                    .attr("width", width)
                    .attr("height", barHeight)
                    .attr("id", "myPattern2")
                    .attr("patternUnits","userSpaceOnUse");

    // Highlighted active trip by svg filter
    var filter = barchart.append('svg:defs')
                    .append('svg:filter')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 1)
                    .attr('height', 1)
                    .attr('id', 'activeTrip')
                    .append('feFlood')
                        .attr('flood-color', 'yellow')
                    .append('feComposite').attr('in', 'SourceGraphic');

    d3.range(slicePattern).forEach(function(d, i) {
        var c1 = color1[i];
        //var c2 = '#fed976';
        pattern.append("rect")
            .attr("height", barHeight)
            .attr("width", (width - 70) / slicePattern)
            .attr("x", ((width - 70) / slicePattern) * i)
            .attr("fill", c1)
            .style('stroke', '#000')
            .style('stroke-width', '1px')
            .attr("transform", "translate(70,0)");

        pattern2.append("rect")
            .attr("height", barHeight)
            .attr("width", (width - 70) / slicePattern)
            .attr("x", ((width - 70) / slicePattern) * i)
            .attr("fill", c1)
            .style('stroke', '#000')
            .style('stroke-width', '1px')
            .attr("transform", "translate(70,0)");
    });

    return barchart;
}

export function preprocessEqualizerData (point, tripIndex)
{
    let data = computeDataset(point, tripIndex);
    data.sort(sortByDateAscending);
    return data;
}

/**
 * 
 */
export function updateEqualizer (data)
{
    let container = dom.equalizer;

    // Need to reset all of this
    // container.css({ height: '60%'});
    $('#equalizer-minimap').hide();

    // Transition time setting
    var t = d3.transition().duration(1000);
    // Specify dimension of the visualization
    let margin = {top: 10, right: 0, bottom: 10, left: 0};
    let width = container.width() - margin.left - margin.right;
    let height = container.height() - margin.top - margin.bottom;
    let barHeight = 18;//height / data.length;

    var color = d3.scale.linear()
                    .domain([2014, 2015, 2016])
                    .range(["#000", "#000", "#000"]);

    var scale = d3.scale.linear().domain([0, 150]).range([0, width]);
    // Binding new dataset
    var binding = Equalizer.selectAll('g')
                    .data(data, function (d) {
                        // data by index
                        return d.index;
                    });
    //binding.attr("transform", "translate(0, 10)");
    
    // Exit
    binding.exit().remove();

    // Update
    binding.select('rect.equalizer-bar')
        .transition(t)
        //.attr("active", false)
        .style('fill', "url('#myPattern')")
        .attr('width', (d) => (d.value >= 1) ? scale(d.value) : 1);

    // Enter
    var g = binding.enter()
                .append('g');

    // Add line to each barchart
    g.append('line')
        .style("stroke-dasharray", ("3, 3"))
        .style('stroke', function (d) {
            var year = new Date (d.date).getFullYear();
            return color(year);
        })
        .attr('x1', 70)
        .attr('y1', function (d, i) {
            return i * barHeight + (barHeight / 2);
        })
        .attr('x2', width)
        .attr('y2', function (d, i) {
            return i * barHeight + (barHeight / 2);
        });

    // Add highlighted text
    g.append('rect')
        .attr('class', 'current-trip')
        .style('fill', (d) => {
            return (d.active) ? 'yellow' : 'none';
        })
        .style('stroke', (d) => (d.active) ? '#000' : 'none')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return i * barHeight;
        })
        .attr('width', (d) => (d.active) ? 70 :'0')
        .attr('height', barHeight);
    
    // Create a datetime label
    g.append("text")
        .style('font-size', '12px')
        .style('fill', function (d) {
            var year = new Date (d.date).getFullYear();
            return color(year);
        })
        .attr("x", - 1.8)
        .attr('y', function (d, i) {
            return i * barHeight + (barHeight / 2) + 4;
        })
        .text(function (d) {
            return d.date;
        });

    let bar = g.append('rect')
                .attr('class', 'equalizer-bar')
                .style('stroke-width', '1px')
                .style('stroke', '#000')
                .attr('x', 70)
                .attr('y', function (d, i) {
                    return i * barHeight;
                })
                .attr('width', 0)
                .attr('height', barHeight)
                .style('fill', "url('#myPattern')");
    
    bar.transition(t)
        .attr('width', (d) => (d.value >= 1) ? scale(d.value) : 1 );

    g.selectAll('rect.equalizer-bar').classed('active', false);

    // Add all equalizer events
    g.on('mouseover', onMouseover);
    g.on('mouseout', onMouseout);
    g.on('click', onClick);

    return;
}

function onMouseover (d, i)
{
    if (!d.active) {
        d3.select(this)
            .style('cursor', 'cell');
        d3.select(this).selectAll('text')
            .style('text-decoration', 'underline');

        if (!d3.select(this).selectAll('rect.equalizer-bar').classed('active')) {
            d3.select(this).selectAll('rect.equalizer-bar')
                .style('fill', "url('#myPattern2')");
        }
    }
    return;
}

function onMouseout (d, i)
{
    if (!d.active) {
        d3.select(this).selectAll('text').style('text-decoration', 'none');
        if (!d3.select(this).selectAll('rect.equalizer-bar').classed('active')) {
            d3.select(this).selectAll('rect.equalizer-bar')
                .style('fill', "url('#myPattern')");
        }
    }
    return;
}

function onClick (d, i)
{

    // Creat events only non active trip
    if (!d.active) {
        if (!d3.select(this).selectAll('rect.equalizer-bar').classed('active')) {

            // Deactive all equalizer bar
            d3.selectAll('rect.equalizer-bar').classed('active', false);
            d3.selectAll('rect.equalizer-bar')
                .style('fill', "url('#myPattern')");
            // Toggle active for equalizer selection
            d3.select(this).style('stroke-width', '1px');
            d3.select(this).style('stroke', 'red');

            // Toggle active for equalizer selection
            d3.select(this).selectAll('rect.equalizer-bar')
                .classed("active", true);


            d3.select(this).selectAll('rect.equalizer-bar')
                .style('fill', "url('#myPattern2')");
            // Enable minimap and decrease equalizer container
            //dom.equalizer.css({ height: '40%'});
            showEqualizerMinimap(d.originalPoint, d.trip, d.pointIndex);
            $('#equalizer-minimap').show();
            return;
        } else {
            d3.select(this).style('stroke-width', 'none');
            d3.select(this).style('stroke', 'none');
            // Deactive selection
            d3.select(this).selectAll('rect.equalizer-bar')
                .classed("active", false);
            d3.select(this).selectAll('rect.equalizer-bar')
                .style('fill', "url('#myPattern')");
            // Disable minimal and expand equalizer
            //dom.equalizer.css({ height: '60%'});
            $('#equalizer-minimap').hide();
            return;
        }
    }
    return;
}