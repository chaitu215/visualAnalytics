import { sequentialBlue } from '../utils/getColor';
import { getCircleMarker, layers, addMapLayer, getImagePath, createImageElement} from '../../component';
import { getCurrentMap } from '../../../main/geovisuals';

export default function (streets, words) {

    layers.streetSemanticPoint.clearLayers();
    let points = filterPointByKeywords(streets, words);
    // Generate semantic points over map by dates
    points.forEach (point => {

        let color = point.color;
        // Get all data point
        point.points.forEach ( item => {

            let marker = getCircleMarker(item.coord, '#fff', color, 1, item);

            var word = 'none';
            words.forEach( w => {
                if (item.narrative.indexOf(w) !== -1) {
                    word = w;
                }
            });

            //$('.customTooltip' + '.' + index).css({ background: keywordColor });
            marker.bindTooltip(word, { permanent: true, className: 'customTooltip' });

            let pathLeft = getImagePath(    item.videoLName, 
                item.videoLTime);
            let pathRight = getImagePath(    item.videoRName, 
                            item.videoRTime);

            // Create image elements
            let imgLeft = createImageElement(pathLeft, 'hovertrip-image', '', '');
            let imgRight = createImageElement(pathRight, 'hovertrip-image', '', '');

            // Add image to marker
            let container = getTooltipContainer(imgLeft, imgRight);

            // var tooltipStr = container.prop('outerHTML') + "<br>" + item.narrative;

            marker.setStyle({ radius: item.frequency + 5, weight: 1 });
            /*
            marker.bindTooltip(tooltipStr, {direction: 'auto', className: 'currentTripTooltip'});
            setEvents(marker, item);*/
            layers.streetSemanticPoint.addLayer(marker);
        });
    });
    // Add all layers to map
    addMapLayer(getCurrentMap(), layers.streetSemanticPoint);
    // Add legend to map
    createLegend(getCurrentMap(), points);
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
            dateContainer.html('<i class="fa fa-circle" style="color:' + point.color + '; text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;<strong>' + (point.date ? point.date : '</strong>+'));
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
            let marker = getCircleMarker(item.coord, '#fff', point.color, 1, item);
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
function filterPointByKeywords (streets, keywords) {

    let result = [];
    let count = 0;

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
            }*/
        }
    });

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
        videoLName: street.videoLNames[index],
        videoLTime: street.videoLTimes[index],
        videoRName: street.videoRNames[index],
        videoRTime: street.videoRTimes[index],
        time: street.times[index],
        sentiment: street.sentiments[index],
        coord: street.points[index],
        frequency: frequnecy
    }
}