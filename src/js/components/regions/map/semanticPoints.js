import { sequentialBlue } from '../utils/getColor';
import { getCircleMarker, layers, addMapLayer, getImagePath, createImageElement, getStreetname} from '../../component';
import { getCurrentMap } from '../../../main/geovisuals';

export default function (streets, words, colors, modes) {

    console.log(words);
    layers.streetSemanticPoint.clearLayers();
    let points = filterPointByKeywords(streets, words, modes, colors);
    console.log(points);
    // Generate semantic points over map by dates
    points.forEach (point => {
        console.log(point);
        let color = point.color;
        let header = '<strong>Date:</strong> ' + point.date + ' <strong>Street: xxxx</strong>';
        // Get all data point
        point.points.forEach ( item => {
            console.log(color);

            // Shift the map to protect the privacy from the police
            /*
            var latLng = L.latLng(item.coord);
            var point = getCurrentMap().latLngToContainerPoint(latLng);
            var newPoint = L.point([point.x + 1000, point.y]);
            var newLatLng = getCurrentMap().containerPointToLatLng(newPoint);*/

            // Swap this
            let marker = getCircleMarker([item.coord[1],item.coord[0]], '#000', color, 0.8, item);

            let pathLeft = getImagePath(    item.videoLName, 
                item.videoLTime);
            let pathRight = getImagePath(    item.videoRName, 
                            item.videoRTime);

            // Create image elements
            let imgLeft = createImageElement(pathLeft, 'hovertrip-image', '', '');
            let imgRight = createImageElement(pathRight, 'hovertrip-image', '', '');

            // Add image to marker
            let container = getTooltipContainer(imgLeft, imgRight);

            var tooltipStr = container.prop('outerHTML') + "<br>" + header + "<br>" + item.narrative;

            marker.setStyle({ radius: item.frequency + 5, weight: 1 });
            marker.bindTooltip(tooltipStr, {direction: 'auto', className: 'currentTripTooltip'});
            setEvents(marker, item);
            layers.streetSemanticPoint.addLayer(marker);
        });
    });
    // Add all layers to map
    addMapLayer(getCurrentMap(), layers.streetSemanticPoint);
    //layers.streetSemanticPoint.setO
    // Add legend to map
    // createLegend(getCurrentMap(), points);
    // getCurrentMap().setC
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


/**
 * Create legend for leaflet map
 * @param {*} map 
 * @param {*} points 
 */
function createLegend (map, points) {

    layers.streetSematicLegend.remove();
    layers.streetSematicLegend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        //var labels = ['<strong> Occurred Date </strong>'];
        $(div).html('<strong> Occurred Date </strong>');
        // Create circle for each point
        points.forEach( point => {

            var dateContainer = $('<div/>').css({ width: '100%', cursor: 'pointer' });
            dateContainer.html('<i class="fa fa-circle" style="color:' + point.color + ' " aria-hidden="true"></i>&nbsp;' + (point.date ? point.date : '+'));
            // Add specific date container
            $(div).append(dateContainer);

            setLegendEvents(dateContainer, point, map);
        });
        return div;
    };
    layers.streetSematicLegend.addTo(map);
    return;
}

/**
 * Set legend hover events
 * @param {*} container 
 * @param {*} point 
 * @param {*} map 
 */
function setLegendEvents (container, point, map) {
    // Could wrap this into a function
    container.on('mouseover', function (e) {
        e.stopPropagation();
        container.css({ border: '1px solid #000'});
        // Highlight specific point
        layers.streetSemanticHover.clearLayers();
        // Get all data point
        point.points.forEach ( item => {
            // Need to swap this
            let marker = getCircleMarker([item.coord[1], item.coord[0]], '#000', point.color, 0.8, item);
            marker.setStyle({ radius: item.frequency + 10, weight: 2});
            layers.streetSemanticHover.addLayer(marker);
        });
        // Add hover to current map
        addMapLayer(map, layers.streetSemanticHover);
    });

    container.on('mouseout', function (e) {
        e.stopPropagation();
        container.css({ border: 'none'});
        layers.streetSemanticHover.clearLayers();
        map.removeLayer(layers.streetSemanticHover);
    });

    return;
}

/**
 * Set clickable events
 * @param {*} marker 
 * @param {*} data 
 */
function setEvents (marker, data) {
    marker.on('click', function () {
        console.log(data);
    });
    return;
}

/**
 * Filter points by keywords and group by date
 * @param {*} streets - streets data
 * @param {*} keyword - keyword selection
 */
function filterPointByKeywords (streets, keywords, modes, colors) {

    let result = [];
    let count = 0;

    function check_or(words, string)
    {
        for (let i = 0; i < words.length; ++i) {
            if (string.indexOf(words[i]) !== -1) {
                let pos = words.indexOf(words[i]);
                return colors[pos];
            }
        }

        return '#fff';
    }

    function check_and(words, string)
    {
        for (let i = 0; i < words.length; ++i) {
            if (string.indexOf(words[i]) === -1) {
                return '#fff';
            }
        }

        return '#4cff00';
    }

    if (modes == "or") {
        console.log(streets);
        for (let i = 0; i < streets.length; ++i) {
            let narratives = streets[i].narratives;

            for (let j = 0; j < narratives.length; ++j) {
                let frequency = 1;
                let color = check_or(keywords, narratives[j]);
                // If word exist
                if (color !== '#fff') {

                    let date = streets[i].dates[j];
                    // Get street name
                    let streetname = getStreetname(streets[i].roadIds[j]);
                    let point = {
                        date: date,
                        street: streetname,
                        points: [],
                        color: color
                    }
                    // Create data object to add to points
                    let data = getDataPoint(streets[i], frequency, j);
                    point.points.push(data);
                    result.push(point);

                    /*
                    let pos = result.map(function (x) {
                        return x.date;
                    }).indexOf(date);*/

                    /*
                    if (pos != -1) {
                        let data = getDataPoint(streets[i], frequency, j);
                        result[pos].points.push(data);

                    } else {
                        // Create point object
                        let point = {
                            date: date,
                            street: streetname,
                            points: [],
                            color: color
                        }
                        // Create data object to add to points
                        let data = getDataPoint(streets[i], frequency, j);
                        point.points.push(data);
                        result.push(point);
                    }*/
                }
            }
        }
    } else {

        for (let i = 0; i < streets.length; ++i) {
            let narratives = streets[i].narratives;

            for (let j = 0; j < narratives.length; ++j) {
                let frequency = 1;
                let color = check_and(keywords, narratives[j]);
                // If word exist
                if (color !== '#fff') {

                    let date = streets[i].dates[j];
                    let streetname = getStreetname(streets[i].roadIds[j]);

                    let pos = result.map(function (x) {
                        return x.date;
                    }).indexOf(date);

                    if (pos != -1) {
                        let data = getDataPoint(streets[i], frequency, j);
                        result[pos].points.push(data);

                    } else {
                        // Create point object
                        let point = {
                            date: date,
                            street: streetname,
                            points: [],
                            color: color
                        }
                        // Create data object to add to points
                        let data = getDataPoint(streets[i], frequency, j);
                        point.points.push(data);
                        result.push(point);
                    }
                }
            }
        }
    }

    return result;

    /*
    streets.forEach (street => {
        console.log(street);
        // Find keyword in each sentence
        for (let i = 0, len = street.narratives.length; i < len; ++i) {

            let sentence = street.narratives[i];
            var frequency = 0;
            keywords.forEach( word => {
                frequency += (sentence.match(new RegExp(word, "g")) || []).length;
            });

            if (frequency > 0) {
                let date = street.dates[i];
                let streetname = street.name;
                let pos = result.map(function (x) {
                    return x.date;
                }).indexOf(date);

                if (pos != -1) {
                    let data = getDataPoint(street, frequency, i);
                    result[pos].points.push(data);
                } else {
                    // Create point object
                    let point = {
                        date: date,
                        street: streetname,
                        points: [],
                        color: sequentialBlue(count)
                    }
                    // Create data object to add to points
                    let data = getDataPoint(street, frequency, i);
                    point.points.push(data);
                    result.push(point);
                    // Increment count
                    count++;
                }
            }

            /*
            let frequency = (sentence.match(new RegExp(keyword, "g")) || []).length;

            if (frequency > 0) {
                
                let date = street.dates[i];
                let streetname = street.name;
                let pos = result.map(function (x) {
                    return x.date;
                }).indexOf(date);

                if (pos != -1) {
                    let data = getDataPoint(street, frequency, i);
                    result[pos].points.push(data);
                } else {
                    // Create point object
                    let point = {
                        date: date,
                        street: streetname,
                        points: [],
                        color: sequentialBlue(count)
                    }
                    // Create data object to add to points
                    let data = getDataPoint(street, frequency, i);
                    point.points.push(data);
                    result.push(point);
                    // Increment count
                    count++;
                }
            }
        }
    });*/

    return result;
}

/**
 * Create data object to add to points
 * @param {*} street 
 * @param {*} index 
 */
function getDataPoint (street, frequnecy, index) {
    return {
        narrative: street.narratives[index],
        videoLName: street.videos[index].nameLeft,
        videoLTime: street.videos[index].timeLeft,
        videoRName: street.videos[index].nameRight,
        videoRTime: street.videos[index].timeRight,
        time: street.times[index],
        sentiment: street.sentiments[index],
        coord: street.locations[index],
        frequency: frequnecy
    }
}