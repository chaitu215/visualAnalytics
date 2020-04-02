import { dom, showSelectKeywords} from '../../component';
import { default as showSemanticPoints } from '../map/semanticPoints';
import { default as generateKeywords } from '../utils/keywords';
import { default as normalize } from '../utils/normalize';
import { removeSelection, update } from '../../../main/geovisuals';
import { sequentialBlue } from '../utils/getColor';

export var selectedKeywordNodes = [];
export var selectedKeywordColors = [];
export var selectedRegions = [];
export var selectedList = [];
export var street_raw_keywords = [0, 0, 0, 0, 0];

// Default semantic selection modes
export var semantic_modes = "or";

/**
 * Draw bubble chart from regions data
 * @param {*} regions 
 */
export default function bubble (regions, list) {
    console.log('draw region bubble');

    if (list.length > 0) {
        $('#map').css({ 'height': '61%' });
        $('#showcase').css({ 'height': '38%', 'margin-top': '0.36%' });
    }

    // Reset raw values
    street_raw_keywords = [0, 0, 0, 0, 0];

    // Store global variables
    selectedRegions = regions;
    selectedList = list;
    semantic_modes = "or";

    dom.semanticBubble.empty();

    // Clear current selection keywords
    selectedKeywordNodes = [];
    selectedKeywordColors = [];

    // Preprocessing data
    // Generate top 10 keywords for each street
    // also normalize its value
    regions = sortTopKeywords(regions, 10);
    regions = normalizeKeywordFrequency(regions);

    // Draw bubble chart of all selected street
    let selectRegions = [];
    regions.forEach( region => {
        if (list.indexOf(region.index) !== -1) {
            //add_Total_Points(score, keyword.frequency);
            selectRegions.push(region);
        }
    });

    // Add legend contianer
    var legend = get_legend_container();
    dom.semanticBubble.append(legend);
    set_semantic_modes_event();

    var bubbleContainer = $('<div/>', {
        id: 'semantic-bubble-container'
    });
    dom.semanticBubble.append(bubbleContainer);

    regions.forEach( region => {
        if (list.indexOf(region.index) !== -1) {
            var div = getContainer(region.index);
            // Need to add div to current container before drawing d3
            bubbleContainer.append(div);
            draw(div, region, selectRegions);
        }
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
            if (semantic_modes == "or") {
                selectedKeywordColors.push(sequentialBlue(selectedKeywordNodes.indexOf(selectWord)));
            } else {
                selectedKeywordColors.push('#4cff00');
            }
            showSelectKeywords(selectedKeywordNodes, selectedKeywordColors);
            //selectedKeywordColors.push(d.color);
        } else {
            // Remove from selected keywords
            selectedKeywordNodes.splice(pos, 1);
            // Remove colors

            // Reset color
            selectedKeywordColors = [];
            for (let i = 0; i < selectedKeywordNodes.length; ++i) {
                (semantic_modes == 'or') ? selectedKeywordColors.push(sequentialBlue(i)) : selectedKeywordColors.push('#4cff00');
            }

            showSelectKeywords(selectedKeywordNodes, selectedKeywordColors);
        }

        // Change border circle when selected
        d3.selectAll('.street-circle')
            .style('stroke-width', (item) => {
                return (selectedKeywordNodes.indexOf(item.text) > -1) ? 6 : 0;
            })
            .style('stroke', (item) => {
                console.log(semantic_modes);
                // Change color base on selection modes
                if (semantic_modes === "or") {
                    let select_index = selectedKeywordNodes.indexOf(item.text);
                    return (selectedKeywordNodes.indexOf(item.text) > -1) ? sequentialBlue(select_index) : '#fff';
                } else {
                    return (selectedKeywordNodes.indexOf(item.text) > -1) ? '#4cff00' : '#fff';
                }
            });
        
        // Update points
        showSemanticPoints(streets, selectedKeywordNodes, selectedKeywordColors, semantic_modes);
        // showSelectKeywords(selectedKeywordNodes, selectedKeywordColors);

    });

    // Create nodes for each keyword
    function create_nodes (word) {
        let i = word.frequency;
        let r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius;
        let d = {
                cluster: 0,
                radius: 25,
                color: getColor(i),
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

// bubble color
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
function getContainer (index) {
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
    }).html('Region ' + index);

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
    return container;
}

// Semantic and or legend also keyword frequency.
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

    // Selection keyword modes
    var and_or_container = $('<div/>').css({
        width: '100%',
        height: '30%',
        /*
        border: '2px solid #525252',
        'border-radius': '5px',*/
        'text-align': 'center',
        'color': '#fff'
    }).html('<strong>Semantic Selections</strong><br/>');

    // Input or radios
    var or_radio = $('<input/>', {
        id: 'or-semantic',
        type: 'radio',
        name: 'semantic-modes',
        value: 'or'
    }).prop('checked', true);
    var or_label = $('<label/>', {
        class: 'form-check-label',
        for: 'or-semantic'
    }).html('&nbsp;OR');

    // Input and radios
    var and_radio = $('<input/>', {
        id: 'and-semantic',
        type: 'radio',
        name: 'semantic-modes',
        value: 'and'
    });
    var and_label = $('<label/>', {
        class: 'form-check-label',
        for: 'and-semantic'
    }).html('&nbsp;AND');

    // Add all radio and its label
    and_or_container.append(or_radio).append(or_label).append('<br/>').append(and_radio).append(and_label);
    // Add semantic mode container
    container.append(and_or_container);

    // Keyword frequency legend
    var frequency_container = $('<div/>').css({
        width: '100%',
        height: '70%',
        'color': '#fff',
        'text-align': 'center',
        'margin-top': '5px',
        'border-top': '1px solid #525252'
    }).html('<strong>Keyword Frequency</strong><br/>');

    var colors = ['#bd0026', '#f03b20','#fd8d3c','#fecc5c','#ffffb2'];
    var values = [90, 70, 50, 30, 10];
    for (let i = 0; i < colors.length; ++i) {
        let circleContainer =  $('<div/>').css({ 
            width: '100%', 
            cursor: 'pointer', 
            'margin-bottom': '10px'
        });
        circleContainer.html('<i class="fa fa-circle" style="color:' + colors[i] + ' " aria-hidden="true"></i>&nbsp; <= &nbsp' + street_raw_keywords[i]);
        frequency_container.append(circleContainer);
    }

    // Add keyword frequency container
    container.append(frequency_container);
    return container;
}

function set_semantic_modes_event()
{
    // radio button click
    // change selection modes
    $('input[name="semantic-modes"]').on('click', function (e) {
        e.stopPropagation();
        if ($("input[name='semantic-modes'][value='or']").is(':checked')) {
            semantic_modes = "or";
        } else {
            semantic_modes = "and";
        }
    });

    return;
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