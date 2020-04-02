import {getCurrentTrip, getAllTrips, getCurrentMap, modes, indexes} from '../../main/geovisuals';
import { layers, getCircleMarker, addMapLayer, resizeMap } from '../map';
import { dom } from '../ui';
import {default as displayWordCloud} from '../vis/wordcloud';
import {prepareKeywords, getStreetname} from '../utils';
import listKeywordTreeSDP from '../streets/ui/listKeywordTreeSDP';

var container = dom.keywordTree;
export var selected_streets = undefined;
export var current_selected_keywords = [];

export default function (region)
{
    selected_streets = region;

    let keywordTreeContainer = $('<div/>',{
        id: 'keywordtree-d3'
    }).css({
        width: '100%',
        height: '100%',
        float: 'left',
        border: '2px solid #000',
        'border-radius': '5px',
        'overflow': 'hidden'
    });

    container.empty();
    container.append(keywordTreeContainer);

    let processedTrips = preprocessData(region);
    console.log(processedTrips);
    show(processedTrips, keywordTreeContainer);
    //initGallery();
}

function preprocessData (trips)
{
    // Store all keywords from every trips
    let allKeywords = [];
    for (let i = 0; i < trips.length; ++i) {
        let keywords = trips[i].keywords;
        for (let j = 0; j < keywords.length; ++j) {
            let keyword = keywords[j];
            if (keyword.length > 0) {
                allKeywords.push(keyword);
            }
        }
    }

    // Get top keywords from all trips.
    let topKeywords = getTopKeywords(allKeywords, 10);

    // console.log(topKeywords); // Debug.
    let preprocessed = generateTreeData(topKeywords, allKeywords);
    
    return preprocessed;
}


function generateTreeData (topKeywords, allKeywords) {

    // top keywords is first level.

    // Initialize tree data.
    let treeData = [];
    treeData.push(createNode('top keywords', 0));

    for (let i in topKeywords) {
        let arr = [];
        arr.push(topKeywords[i].keyword);
        let parent = createNode(topKeywords[i].keyword, topKeywords[i].frequency);
        let child  = getChildNode(arr, allKeywords);
        parent.children = child;

        // Second level.
        for (let j in parent.children) {
            arr.push(parent.children[j].name);
            let secondChild = getChildNode(arr, allKeywords);
            parent.children[j].children = secondChild;
            // Third level.
            for (let k in parent.children[j].children) {
                arr.push(parent.children[j].children[k].name);
                let thirdChild = getChildNode(arr, allKeywords);
                // Process children.
                for (let m = 0 ; m < thirdChild.length; ++m) {
                    thirdChild[m].children = null;
                }

                parent.children[j].children[k].children = thirdChild;

                arr.splice(2,1);
            }

            arr.splice(1,1);
        }
        
        treeData[0].children.push(parent);
    }
    //console.log(treeData);
    return treeData;
}

function createNode (value, freq) 
{
    return {
        name: value,
        frequency: freq,
        children: []
    };
}

// TODO: need to fix this child nodes
function getChildNode (arr, keywords) {
    let top = [], child = [];
    for (let i = 0; i < keywords.length; ++i) {
        let keyword = keywords[i];

        if (contains(arr, keyword)) {

            console.log(arr);
            console.log(keywords);


            
            for (let j = 0; j < keyword.length; ++j) {
                let word = keyword[j];
                if (arr.indexOf(word) == -1) {
                    let pos = top.map(function (e) {
                        return e.word;
                    }).indexOf(word),
                        item = { word: word, freq: 1 };

                    (pos == -1) ? top.push(item) : top[pos].freq++;
                }
            }
        }
    }

    top.sort(function (a, b) {
        return b.freq - a.freq;
    });

    // Slice top 20 words
    let topChild = top.slice(0, 10);

    for (let i = 0; i < topChild.length; ++i) {
        // Create child nodes
        child.push(createNode(topChild[i].word, topChild[i].freq));
    }

    return child;
}

function contains (needles, haystack) {
    for (let i = 0, len = needles.length; i < len; ++i) {
        if ($.inArray(needles[i], haystack) == -1) return false; 
    }
    return true;
}

function show (treeData, container)
{
    //console.log(container);
    //console.log(treeData);
    // Tooltip.
    let tooltip = d3.select('#' + container.attr('id'))
                    .append('div')
                    .attr('class', 'my-tooltip')
                    .style('position', 'absolute')
                    .style('z-index', '10')
                    .style('visibility', 'hidden');

    // legend
    let legend = d3.select('#' + container.attr('id'))
                    .append('div')
                    .attr('class', 'keyword-tree-legend')
                    .style('position', 'absolute')
                    .style('z-index', '10');


    let margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 10
    };

    let width = container.width() - margin.right - margin.left,
        height = container.height() - margin.top - margin.bottom;

    let i = 0,
        duration = 750,
        root;
    
    // Initialize d3 tree diagram.
    let tree = d3.layout.tree()
                .size([height, width]);

    // Diagonal projector.
    let diagonal = d3.svg.diagonal()
                    .projection(function (d) {
                        return [d.y, d.x];
                    });

    let svg = d3.select('#' + container.attr('id')).append('svg')
                .attr('width', width + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Find total SDPs from existing narratives.
    function findSDPs (node) {
        
        let keywords = [];
        if (node.name != 'top keywords') {
            keywords.push(node.name);
        }

        let parent = (node.parent) ? node.parent : undefined;
        while (parent != undefined && parent.name != 'top keywords') {
            keywords.push(parent.name);
            parent = parent.parent;
        }
        let sdps = 0;

        let trips = getAllTrips();
        for (let i = 0; i < trips.length; ++i) {
            for (let j = 0; j < trips[i].keywords.length; ++j) {
                let allKeywords = trips[i].keywords[j];
                if (allKeywords.length > 0 && contains(keywords, allKeywords)) {
                    sdps += 1;
                }
            }
        }

        //console.log(sdps);

        //console.log(keywords);
        //console.log(sdps);
        return sdps;
    }


    // Root data
    root = treeData[0];

    // Move it to the middle.
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    // Collapse first level from root.
    root.children.forEach(collapse);
    update(root);

    d3.select(self.frameElement).style('height', '400px');

    function update (source) {
        let nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        nodes.forEach(function (d) {
            d.y = d.depth * 150;
        });

        let strokemin = 0;
        let strokemax = 0;

        nodes.forEach(function (d) {
            if (d.frequency > strokemax) {
                strokemax = d.frequency;
            } else {
                strokemin = d.frequency;
            }
        });

        let strokeWidth = d3.scale.linear()
                            .domain([strokemin, strokemax])
                            .range([1, 10]);
        
        let fillColor = d3.scale.linear()
                            .domain([ d3.min(nodes, function (d) {
                                return d.frequency;
                            }), d3.max(nodes, function (d) {
                                return d.frequency;
                            })])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.rgb("#d53e4f"), d3.rgb('#3288bd')]);

        // Compute sdps
        nodes.forEach(function (d) {
            d.points = findSDPs(d);
        });


        let lv1 = [], lv2 = [], lv3 = [], lv4 = [];
        nodes.forEach(function (d) {
            switch (d.depth) {
                case 0: break;
                case 1: lv1.push(d.points); break;
                case 2: lv2.push(d.points); break;
                case 3: lv3.push(d.points); break;
                case 4: lv4.push(d.points); break;
            }
            return;
        });

        // Compute Radius of all nodes.
        function getRadius (value, arr) {
            // 
            let scale = d3.scale.linear()
                            .domain([d3.min(arr), d3.max(arr)])
                            .range([3, 12]);
            // 
            return scale(value);
        }

        // Compute Radius.
        nodes.forEach(function (d) {
            switch (d.depth) {
                case 0: d.radius = 3; break;
                case 1: d.radius = getRadius(d.points, lv1); break;
                case 2: d.radius = getRadius(d.points, lv2); break;
                case 3: d.radius = getRadius(d.points, lv3); break;
                case 4: d.radius = getRadius(d.points, lv4); break;
            }
            return;
        });

        // filter root nodes.
        nodes = nodes.filter(function (d) {
            return d.depth != 0;
        });

        // filter root links.
        links = links.filter(function (d) {
            return d.source.depth != 0;
        });

        let node = svg.selectAll('g.node')
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });
        
        //current_selected_keywords = [];
        let nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', function (d) {
                return 'translate(' + source.y0 + ',' + source.x0 + ')';
            })
            .on('click', function (d) {

                // Click node
                click_node(d);
                var current = d;

                // Select new root
                if (current.parent.name === 'top keywords') {
                    current_selected_keywords = [];
                    current_selected_keywords.push(current.name);
                    updateLegend(current_selected_keywords);
                    update_sdps(current_selected_keywords);
                    // Highlight select keywords , circle styles
                    d3.select('#node-' + current.divid).style('fill', '#d53e4f');
                }

                // Reset every stroke and nodes
                d3.selectAll('.link').style('stroke', '#d9d9d9');
                d3.selectAll('.node-circle').style('fill', '#fff');
                d3.select('#' + d.divid).classed("clicked", !d3.select('#' + d.divid).classed("clicked"));

                if (d3.select('#' + d.divid).classed('clicked')) {

                    d3.selectAll('.link').classed('clicked', false);

                    // Reset current selected keywords
                    current_selected_keywords = [];
                    // Add first selected keywords
                    current_selected_keywords.push(current.name);
                    // Link styles
                    d3.select('#' + current.divid).classed('clicked', true);
                    d3.select('#' + current.divid).style('stroke', '#d53e4f');
                    d3.select('#' + current.divid).style('stroke-width', '3px');
                    // Circle styles
                    d3.select('#node-' + current.divid).style('fill', '#d53e4f');

                    // Add all parent keywords
                    while (current.parent.name !== 'top keywords' && current.parent !== undefined) {
                        current_selected_keywords.push(current.parent.name);
                        // Assign new current
                        current = current.parent;
                        d3.select('#' + current.divid).classed('clicked', true);
                        d3.select('#' + current.divid).style('stroke', '#d53e4f');
                        d3.select('#' + current.divid).style('stroke-width', '3px');
                        // Circle styles
                        d3.select('#node-' + current.divid).style('fill', '#d53e4f');
                    }

                    updateLegend(current_selected_keywords);
                    update_sdps(current_selected_keywords);
        
                } else {

                    d3.selectAll('.link').classed('clicked', false);

                    // Remove selected keywords
                    current_selected_keywords.splice(current_selected_keywords.indexOf(current.name), 1);
                    // Remove selected keywords style
                    d3.select('#' + current.divid).classed('clicked', false);
                    d3.select('#' + current.divid).style('stroke', '#d9d9d9');
                    d3.select('#' + current.divid).style('stroke-width', '2px');
                    d3.select('#node-' + current.divid).style('fill', '#fff');

                    // Get all current parents
                    while (current.parent.name !== 'top keywords' && current.parent !== undefined) {
                        // Assign new current
                        current = current.parent;
                        // Still highlight parent
                        d3.select('#' + current.divid).classed('clicked', true);
                        d3.select('#' + current.divid).style('stroke', '#d53e4f');
                        d3.select('#' + current.divid).style('stroke-width', '3px');
                        // Circle styles
                        d3.select('#node-' + current.divid).style('fill', '#d53e4f');
                    }

                    updateLegend(current_selected_keywords);
                    update_sdps(current_selected_keywords);
                }

                function update_sdps(keywords)
                {
                     // get select keywords
                    let items = getSelectedKeywordItems(keywords);
                    console.log(items);
                    // Clear keyword tree points
                    layers.keywordTreePoints.clearLayers();
                    items.forEach( point => {

                        let marker = new L.circleMarker(point.path, {
                            color: '#000',
                            opacity: 1,
                            radius: 5,
                            fillColor: '#4cff00',
                            fillOpacity: 1,
                            stroke: true,
                            weight: 1.5
                        });

                        layers.keywordTreePoints.addLayer(marker);
                    });

                    // Add map layer
                    addMapLayer(getCurrentMap(), layers.keywordTreePoints);
                    listKeywordTreeSDP(items, keywords);
                    // Resize map after list keyword sdps
                    resizeMap(getCurrentMap());
                }

            })
            .on('mouseover', function (d) {

                if (!d3.select('#' + d.divid).classed('clicked')) {
                    d3.select('#' + d.divid).style('stroke', '#d53e4f');
                    let parent = (d.parent) ? d.parent : undefined;
                    while (parent != undefined && parent.name != 'top keywords' && !d3.select('#' + parent.divid).classed('clicked')) {
                        d3.select('#' + parent.divid).style('stroke', '#d53e4f');
                        parent = parent.parent;
                    }   
                }

            })
            .on('mouseout', function (d) {

                if (!d3.select('#' + d.divid).classed('clicked')) {
                    d3.select('#' + d.divid).style('stroke', '#d9d9d9');
                    let parent = (d.parent) ? d.parent : undefined;
                    while (parent != undefined && parent.name != 'top keywords' && !d3.select('#' + parent.divid).classed('clicked')) {
                        d3.select('#' + parent.divid).style('stroke', '#d9d9d9');
                        parent = parent.parent;
                    }      
                }
            });


        // Create circle for each node
        nodeEnter.append('circle')
            .attr('id', (d) => { return 'node-' + d.divid})
            .attr('class', 'node-circle')
            .attr('r', 1e-6);
            /*
            .style('fill', function (d) {
                return '#fff';
                //console.log(d);
                //return d._children ? fillColor(d.frequency) : '#ffffff';
            });*/
        
        nodeEnter.append('text')
            .attr('x', function (d) {
                return d.children || d._children ? - 20 : 20;
            })
            .attr('dy', '.35em')
            .attr('text-anchor', function (d) {
                return d.children || d._children ? 'end' : 'start';
            })
            .text(function (d) {
                return d.name;// + ' [' + d.frequency + ']';
            })
            .style('fill', (d) => { return } )
            .style('fill-opacity', 1e-6);

        let nodeUpdate = node.transition()
            .duration(duration)
            .attr('transform', function (d) {
                return 'translate(' + d.y + ',' + d.x + ')';
            });
        
        nodeUpdate.select('circle')
            .attr('id', (d) => { return 'node-' + d.divid})
            .attr('class', 'node-circle')
            .attr('r', function (d) {
                return d.radius;
            })
            .style('stroke-width', '2px')
            .style('stroke', '#000');
            /*
            .style('fill', function (d) {
                return d._children ? '#ffffff' : '#d53e4f';
            });*/
            //.attr('stroke-width', '20px')
            //.attr('stroke', '#000') ;

        nodeUpdate.select('text')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill-opacity', 1)
            .style('fill', '#000')
            .style('text-shadow', '-2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff');

        let nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + source.y + ',' + source.x + ')';
                        })
                        .remove();

        nodeExit.select('circle')
                .style('fill', 'red')  
                .attr('r', 1e-6);
        
        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        let link = svg.selectAll('path.link')
                    .data(links, function (d) {
                        return d.target.id;
                    });

        link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('id', function (d) {
                return 'node-' + d.target.id;
            })
            .attr('d', function (d) {
                let o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({ source: o, target: o});
            })
            .attr('fill', 'none');

        link.transition()
            .duration(duration)
            .attr('d', diagonal);

        link.exit().transition()
            .duration(duration)
            .attr('d', function (d) {
                let o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({ source: o, target: o});
            })
            .remove();

        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
            d.divid = 'node-' + d.id
        });

        // Click on specific node
        function click_node (d) {

            if (d.depth == 1) {
                root.children.forEach(collapse);
            }

            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }

            update(d);
        }
    }
}

function arrayContainsArray (superset, subset) {
    if (0 === subset.length) {
      return false;
    }
    return subset.every(function (value) {
      return (superset.indexOf(value) >= 0);
    });
}


function getSelectedKeywordItems (selectedKeywords)
{
    
    // detect street modes
    if (modes.spatialUnit === "street") {
        let result = [];
        let streets = selected_streets;

        // Select all city
        if (modes.roiSelection) {

            let trips = getAllTrips();
            // Detect selected list
            for (let i = 0; i < trips.length; ++i) {
                let keywords = trips[i].keywords;
                let points = trips[i].path;
                console.log(keywords);
                for (let j = 0; j < keywords.length; ++j) {
                    let found = arrayContainsArray(keywords[j], selectedKeywords);
                    if (found) {
                        let item = {
                            pointIndex: j,
                            trip: trips[i],
                            narrative: trips[i].narratives[j],
                            path: points[j],
                            date: trips[i].date,
                            time: trips[i].times[j],
                            videoLNames: trips[i].videoLNames[j],
                            videoRNames: trips[i].videoRNames[j],
                            videoLTimes: trips[i].videoLTimes[j],
                            videoRTimes: trips[i].videoRTimes[j],
                            keywords: trips[i].keywords[j],
                            score: calculateScore(trips[i].keywords[j], selectedKeywords)
                        }
                        result.push(item);
                    }
                }
            }

            return result;

        } else {

            // Detect selected list
            for (let i = 0; i < streets.length; ++i) {
                if (indexes.lists.indexOf(i + 1) !== -1) {
                    let keywords = streets[i].keywords;
                    let points = streets[i].points;
                    for (let j = 0; j < keywords.length; ++j) {
                        let found = arrayContainsArray(keywords[j], selectedKeywords);
                        if (found) {
                            let item = {
                                narrative: streets[i].narratives[j],
                                path: points[j],
                                pointIndex: j,
                                date: streets[i].dates[j],
                                time: streets[i].times[j],
                                videoLNames: streets[i].videoLNames[j],
                                videoRNames: streets[i].videoRNames[j],
                                videoLTimes: streets[i].videoLTimes[j],
                                videoRTimes: streets[i].videoRTimes[j],
                                keywords: streets[i].keywords[j],
                                score: calculateScore(streets[i].keywords[j], selectedKeywords)
                            }
                            result.push(item);
                        }
                    }
                    
                }
            }

            return result;
        }

        return undefined;
    }

    // detect region modes
    if (modes.spatialUnit === "region") {
        let result = [];
        let regions = selected_streets;
        for (let i = 0; i < regions.length; ++i) {
            if (indexes.lists.indexOf(regions[i].index) !== -1) {
                let keywords = regions[i].keywords;
                let points = regions[i].locations;
                for (let j = 0; j < keywords.length; ++j) {
                    let found = arrayContainsArray(keywords[j], selectedKeywords);
                    if (found) {
                        let item = {
                            narrative: regions[i].narratives[j],
                            pointIndex: j,
                            path: points[j],
                            date: regions[i].dates[j],
                            time: regions[i].times[j],
                            videoLNames: regions[i].videos[j].nameLeft,
                            videoRNames: regions[i].videos[j].nameRight,
                            videoLTimes: regions[i].videos[j].timeLeft,
                            videoRTimes: regions[i].videos[j].timeRight,
                            keywords: regions[i].keywords[j],
                            score: calculateScore(regions[i].keywords[j], selectedKeywords)
                        }
                        result.push(item);
                    }
                }
            }
        }
        
        return result;
    }

    return undefined;

    // Remove every thing
    // console.log(selectedKeywords);

    //console.log(selected_streets);
    /*
    let trips = getAllTrips();
    //console.log(trips);

    // Detect if region or not

    // console.log(trips);

    let points = [];
    for (let i = 0; i < trips.length; ++i) {
        let keywords = trips[i].keywords;
        for (let j = 0; j < keywords.length; ++j) {
            let keyword = keywords[j];
            if (keyword.length > 0) {
                if (contains(selectedKeywords, keyword)) {
                    
                    // Create item objects
                    let item = {
                        trip: trips[i],
                        pointIndex: j,
                        index: trips[i].index,
                        tripid: trips[i].id,
                        date: trips[i].date,
                        time: trips[i].times[j],
                        //imageLeft: getImagePath(trips[i].videoLNames[j], trips[i].videoLTimes[j]),
                        //imageRight: getImagePath(trips[i].videoRNames[j], trips[i].videoRTimes[j]),
                        roadid: trips[i].roadids[j],
                        //streetname: getStreetname(trips[i].roadids[j]),
                        narrative: trips[i].narratives[j],
                        path: trips[i].path[j],
                        nextPath: trips[i].path[j + 1],
                        videoLNames: trips[i].videoLNames[j],
                        videoRNames: trips[i].videoRNames[j],
                        videoLTimes: trips[i].videoLTimes[j],
                        videoRTimes: trips[i].videoRTimes[j],
                        keywords: trips[i].keywords[j],
                        score: calculateScore(keyword, selectedKeywords)
                    }

                    
                    points.push(item);
                }
            }
        }
    }*/
    
    // return points;
}

function calculateScore (keywords, selectedKeywords)
{
    let score = 0;
    for (let i = 0; i < keywords.length; ++i) {
        let index = selectedKeywords.indexOf(keywords[i]);
        if (index > -1) {
            score++;
        }
    }
    return score;
}


// Update keyword tree legend
function updateLegend (keywords)
{
    $('.keyword-tree-legend').empty();
    $('.keyword-tree-legend').html('<strong>LINKED KEYWORDS</strong>');
    
    if (keywords.length != 0) {
        
        for (let i = keywords.length - 1; i >= 0; --i) {

            let div = $('<div/>', {
                class: 'legend1'
            }).css({
                width: '100%',
                height: 'auto',
                background: '#fee0d2',
                border: '2px solid #fc9272',
                'border-radius': '5px',
                'margin-top': '2px',
                'text-align': 'center'
            });

            let span = $('<span/>').css({
                'color': '#000',
                'font-weight': 'bold'
            });
            
            span.text(keywords[i]);
            //p.append(span);
            div.append(span);
            $('.keyword-tree-legend').append(div);
        }
    }

    return;
}

function getTopKeywords (keywords, top) {
    
    let topKeywords = [];

    for (let i = 0; i < keywords.length; ++i) {
        let keyword = keywords[i];

        if (keyword.length != 0) {
            for (let j = 0; j < keyword.length; ++j) {
                // Check if word already exist in the topKeywords.
                let word = keyword[j],
                    pos = topKeywords.map(function (x) {
                        return x.keyword;
                    }).indexOf(word);
                // Word is exist.
                if (pos != -1) {
                    topKeywords[pos].frequency++;
                } else {
                    // Create new word object.
                    let obj = {
                        keyword: word,
                        frequency: 1
                    }
                    // Store it in current result.
                    topKeywords.push(obj);
                }
            }
        }
    }

    // Sort top keyword result and slice it.
    topKeywords.sort(function (a, b) { 
        return b.frequency - a.frequency; 
    });

    return topKeywords.slice(0, top);
}

// Initialize gallery 
function initGallery()
{
    let gallery = $('<div/>', {
        id: 'keywordtree-gallery'
    }).css({
        float: 'left',
        width: '49%',
        height: '100%',
        'border': '2px solid #000',
        'margin-left': '2%',
        'margin-bottom': '2px',
        'border-radius': '5px',
        'overflow': 'auto',
        'font-size': '12px'
    });

    container.append(gallery);
    //keywordTreeGallery = gallery;
    return;
}

// Visualize word cloud
/*
function show_wordcloud(points, selected_keywords)
{

    let keywords = [];
    points.forEach( point => {
        keywords.push(point.keywords);
    });
    let data = prepareKeywords(keywords);

    // Create color
    function getDepthColor (depth) {
        return  depth == 3 ? '#b3de69' :
                depth == 2 ? '#fdb462' :
                depth == 1 ? '#80b1d3' : '#fb8072';
    }

    let color_data = [];
    for (let i = 0; i < selected_keywords.length; ++i) {
        let item = {
            color: getDepthColor(i),
            word: selected_keywords[i]
        }
        color_data.push(item);
    }

    displayWordCloud($('#keywordtree-gallery'), data, '#000', color_data);
    return;
}*/