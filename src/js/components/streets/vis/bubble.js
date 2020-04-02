import { dom, addKeywords, clearKeywords, showSelectKeywords} from '../../component';
import { default as showSemanticPoints } from '../map/semanticPoints';
import { default as generateKeywords } from '../utils/keywords';
import { default as normalize } from '../utils/normalize';
import { removeSelection, update } from '../../../main/geovisuals';

export var selectedKeywordNodes = [];
export var selectedKeywordColors = [];
export var selectedStreets = [];
export var street_raw_keywords = [0, 0, 0, 0, 0];
/**
 * Draw bubble chart from streets data
 * @param {*} streets 
 */
export default function (streets) {
    console.log('draw street bubble');

    // Reset raw values
    street_raw_keywords = [0, 0, 0, 0, 0];

    selectedStreets = streets;
    dom.semanticBubble.empty();

    // Clear current selection keywords
    selectedKeywordNodes = [];
    selectedKeywordColors = [];

    // Preprocessing data
    // Generate top 10 keywords for each street
    // also normalize its value
    streets = sortTopKeywords(streets, 10);

    var streets_norm = normalizeKeywordFrequency(streets);
    // Add legend contianer
    var legend = get_legend_container();
    dom.semanticBubble.append(legend);
    
    var bubbleContainer = $('<div/>', {
        id: 'semantic-bubble-container'
    });
    dom.semanticBubble.append(bubbleContainer);

    // Draw bubble chart of all selected street
    streets_norm.forEach( street => {
        var div = getContainer(street.index, street.name);
        // Need to add div to current container before drawing d3
        bubbleContainer.append(div);
        draw(div, street, streets_norm);
    });

    return;
}

/**
 * Get all top value and sort it
 * @param {*} streets 
 * @param {*} top 
 */
function sortTopKeywords (streets, top) {
    streets.forEach(street => {
        street.keywords = generateKeywords(street.keywords, top);
    });
    return streets;
}

/**
 * Normalize all keyword frequency
 * @param {*} streets 
 */
function normalizeKeywordFrequency (streets) {

    // Find maximum keyword frequency
    var min = 1, max = 0;
    streets.forEach(street => {
        street.keywords.forEach ( keyword => {
            max = (keyword.frequency > max) ? keyword.frequency : max;
        });
    });

    // Normalize all frequency value of each keyword
    streets.forEach(street => {
        street.keywords.forEach( keyword => {
            let score = normalize(keyword.frequency, [min, max], [0, 100]);
            add_Total_Points(score, keyword.frequency);
            keyword.frequency = score;
        });
    });

    return streets;
}

/**
 * Draw semantic bubble chart
 * @param {*} container 
 * @param {*} streets 
 */
function draw (container, street, streets) {

    let width = container.width();
    let height = container.height();
    let m = 1;
    let padding = 0.5;
    let clusterPadding = 6;
    let maxRadius = 12;
    var clusters = new Array(m);
    var nodes = [];

    // Create all nodes
    street.keywords.forEach( keyword => {
        nodes.push(create_nodes(keyword));
    });

    // Create d3 force layout
    var force = d3.layout.force()
                .nodes(nodes)
                .size([width, height])
                .gravity(.02)
                .charge(0)
                .on("tick", tick)
                .start();
    var svg = d3.select('#' + container.attr('id')).append("svg")
                .attr("width", width)
                .attr("height", height);

    // Create node's circle
    var node = svg.selectAll("circle")
                .data(nodes)
                .enter().append("g").call(force.drag);

    // Circle attributes
    node.append("circle")
        //.style("stroke", "#565352")
        //.style("stroke-width", 1)
        .attr('class', 'street-circle')
        .style("cursor", "pointer")
        .style("fill", function (d) {
            return d.color;
        })
        .attr("r", function(d){return d.radius})
        
    // Create keyword text inside each bubble
    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style('font-weight', 'bold')
        .style('fill', '#000')
        .text(function(d) { return d.text.substring(0, 7); });

    // Node clicking events
    node.on('click', function (d) {

        var selectWord = d.text;
        var pos = selectedKeywordNodes.indexOf(selectWord);

        if (pos === -1) {
            // Add to selected keywords
            selectedKeywordNodes.push(selectWord);
            // Add color
            selectedKeywordColors.push(d.color);
        } else {
            // Remove from selected keywords
            selectedKeywordNodes.splice(pos, 1);
            // Remove colors
            selectedKeywordColors.splice(pos, 1);;
        }

        d3.selectAll('.street-circle')
            .style('stroke-width', (item) => {
                return (selectedKeywordNodes.indexOf(item.text) > -1) ? 4 : 0;
            })
            .style('stroke', (item) => {
                return (selectedKeywordNodes.indexOf(item.text) > -1) ? '#4cff00' : '#fff';
            });

        showSemanticPoints(streets, selectedKeywordNodes);
        showSelectKeywords(selectedKeywordNodes, selectedKeywordColors);

    });

    // Create nodes for each keyword
    function create_nodes (word) {
        let i = word.frequency;
        let r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius;
        let d = {
                cluster: 0,
                radius: 25,
                color: getColor(i),
                freq: i,
                text: word.keyword,
                x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
            };
        if (!clusters[0] || (r > clusters[0].radius)) clusters[0] = d;
        return d;
    }

    function tick(e) {
        node.each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
        .attr("transform", function (d) {
            var k = "translate(" + d.x + "," + d.y + ")";
            return k;
        })
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
        return function (d) {
            var cluster = clusters[d.cluster];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
            if (l != r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function (d) {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
}

function getColor (d) {

    return  d >= 90  ? '#bd0026' :
            d >= 70  ? '#f03b20' :
            d >= 50  ? '#fd8d3c' :
            d >= 30  ? '#feb24c' : '#fed976';
}




/**
 * Create container for each streets with remove button
 * @param {*} index - street index 
 * @param {*} name - street name
 */
function getContainer (index, name) {
    // Create street container
    var container = $('<div/>', {
        id: 'bubble-' + index
    }).css({
        'margin-right': '5px',
        position: 'relative',
        width: '250px', height: '100%',
        background: 'rgba(0,0,0,0.5)',
        border: '2px solid #525252',
        display: 'inline-block',
        'border-radius': '15px 30px'
    });

    // Create street name header
    var header = $('<div/>').css({
        position: 'absolute',
        top: '5px', left: '30%',
        width: 'auto', height: 'auto',
        color: '#fff',
        'font-size': '14px',
        'font-weight': 'bold'
    }).html(name);

    // Create remove button for removing a particular street
    var removeBtn = $('<button/>').css({
        position: 'absolute',
        top: '5px', left: '5px',
        width: 'auto', height: 'auto',
        border: 'none', outline: 'none',
        'border-radius': '10px',
        color: '#000', background: 'orange',
        'font-size': '10px', 'font-weight': 'bold',
        cursor: 'pointer'
    }).html('<i class="fa fa-times" aria-hidden="true"></i>');

    // Set remove button events
    removeBtn.on('click', function (e) {
        e.stopPropagation();
        // Remove current street container
        container.remove();
        removeSelection(index);
        update();
    });

    container.append(header).append(removeBtn);

    // Add hover function to remove button
    removeBtn.hover(() => {
        removeBtn.css({ 'font-size': '14px'});
    }, () => {
        removeBtn.css({ 'font-size': '10px' });
    });

    return container;
}

function get_legend_container()
{
    // Fill out 0 score
    for (let i = 0; i < street_raw_keywords.length; ++i) {
        if (street_raw_keywords[i] == 0) {
            street_raw_keywords[i] = (street_raw_keywords[i - 1] + street_raw_keywords[i + 1]) / 2;
        }
    }

    var container = $('<div/>', {
        id: 'bubble-legend'
    }).css({
        'margin-right': '5px',
        position: 'relative',
        width: '10%', height: '100%',
        background: 'rgba(0,0,0,0.5)',
        border: '2px solid #525252',
        display: 'inline-block',
        'border-radius': '5px',
        float: 'left'
    });

    // Create street name header
    var header = $('<div/>').css({
        position: 'absolute',
        top: '5px', left: '0px',
        width: '100%', height: 'auto',
        color: '#fff',
        'font-weight': 'bold'
    }).html('<center>Keyword <br/> Frequency</center>');

    var legendContainer = $('<div/>').css({
        width: '100%',
        height: '100%',
        'color': '#fff',
        position: 'absolute',
        top: '30%',
        left: '25px'
    });

    container.append(header);
    container.append(legendContainer);

    var colors = ['#bd0026', '#f03b20','#fd8d3c','#fecc5c','#ffffb2'];
    var values = [90, 70, 50, 30, 10];

    for (let i = 0; i < colors.length; ++i) {
        let circleContainer =  $('<div/>').css({ width: '100%', cursor: 'pointer', 'margin-bottom': '10px', 'font-weight': 'bold' });
        circleContainer.html('<i class="fa fa-circle" style="color:' + colors[i] + ' " aria-hidden="true"></i>&nbsp; <= &nbsp' + street_raw_keywords[i]);
        legendContainer.append(circleContainer);
    }


    return container;
}

// Add street points to total values
// This used for map
function add_Total_Points(normalized_score, original_score)
{

    if (normalized_score >= 90) {
        if (original_score > street_raw_keywords[0]) {
            street_raw_keywords[0] = original_score;
        }
        return;
    } else if (normalized_score >= 70) {
        if (original_score > street_raw_keywords[1]) {
            street_raw_keywords[1] = original_score;
        }
        return;
    } else if (normalized_score >= 50) {
        if (original_score > street_raw_keywords[2]) {
            street_raw_keywords[2] = original_score;
        }
        return;
    } else if (normalized_score >= 30) {
        if (original_score > street_raw_keywords[3]) {
            street_raw_keywords[3] = original_score;
        }
        return;
    } else {
        if (original_score > street_raw_keywords[4]) {
            street_raw_keywords[4] = original_score;
        }
        return;
    }
}