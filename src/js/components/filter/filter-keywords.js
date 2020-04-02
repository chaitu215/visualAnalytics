import {default as dom} from '../ui/domElements';
import {addToManager} from '../map';
import * as geovisuals from '../../main/geovisuals';

const input = $('#filter-keyword-input');
const button = $('#filter-keyword-btn');
const keywordSVG = '#filter-keyword-svg';

let keywordData;
let keywordDocument;
let underlineKeywords = [];

export function initializeKeywords(trips) {
    keywordData = prepareData(trips);
    keywordDocument = keywordData;
    setInputEvents(trips);
    setSearchButtonEvent();
    displayBarChart(keywordDocument);
    return;
}

function prepareData(trips) {
    let result = [];
    console.log(trips);
    trips.forEach( function (trip) {
        let keywords = trip.keywords;
        for (let i = 0; i < keywords.length; ++i) {
            let words = keywords[i];
            if (words.length > 0) {
                for (let j = 0; j < words.length; ++j) {
                    let word = words[j];
                    let pos = result.map( function (x) {
                        return x.word;
                    }).indexOf(word);
                    
                    if (pos != -1) {
                        result[pos].frequency++;
                    } else {
                        let keyword = { word: word, frequency: 1};
                        result.push(keyword);
                    }
                }
            }
        }
    });

    result.sort(function (a, b) {
        return b.frequency - a.frequency;
    });

    return result;
}

function setInputEvents(trips) {

    let delay = ( function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    input.keyup( function () {
        if (input.val() == "" || input.val() == " ") {
            initializeKeywords(trips);
            return;
        }

        let searchWord = input.val().split(' ');
        // Get last word inside the input.
        let word = searchWord[searchWord.length - 1];

        let options = {
            caseSensitive: false,
            shouldSort: true,
            threshold: 0,
            location: 0,
            distance: 100,
            maxPatternLength: 100,
            minMatchCharLength: 1,
            keys: [ "word" ]
        };

        let fuzzy = new Fuse(keywordData, options);
        let result = fuzzy.search(word);

        // Resort and swap between founded result.
        // Using some logic.
        for (let i = 0; i < result.length; ++i) {
            let index = keywordData.findIndex(x => x.word == result[i].word);
            // Swapping keyword and move it to the top.
            let temp = keywordData[i];
            keywordData[i] = result[i];
            keywordData[index] = temp;
        }

        delay( function () {
            if (!input.val()) {
                displayBarChart(keywordDocument);
            } else {
                displayBarChart(keywordData);
            }
        });

    });
    return;
}

export function filterByKeywords(trips) {

    if (input.val() !== "") {
        let inputStr = input.val().split(' ');
        for (let i = 0; i < inputStr.length; ++i) {
            if (inputStr[i].toUpperCase() != "AND" && inputStr[i].toUpperCase() != "OR" && inputStr[i].toUpperCase() != "NOT") {
                underlineKeywords.push(inputStr[i]);
            }
        }
    }

    // Filter keywords
    if (input.val() !== "") {

        let data = {
            name: input.val(),
            layer: new L.FeatureGroup()
        };

        for (let i = 0; i < trips.length; ++i) {
            let trip = trips[i];
            let keywords = trip.keywords,
                narratives = trip.narratives;
            for (let j = 0; j < narratives.length; ++j) {
                if (narratives[j] !== "none") {
                    if (boolKeywords(keywords[j]) != undefined) {
                        if (!boolKeywords(keywords[j])) {
                            narratives[j] = "none";
                            keywords[j] = [];
                            /*
                            if (narratives[j].split(' ')[0] !== "Updated") {
                                narratives[j] = "none";
                                keywords[j] = [];
                            }*/
                        } else {
                            let pulseIcon = L.icon.pulse({
                                iconSize: [5, 5],
                                color: 'red',
                                heartbeat: 1
                            });
                            let marker = L.marker(trip.path[j], {
                                icon: pulseIcon,
                                clickable: false
                            });
                            data.layer.addLayer(marker);
                        }
                    }
                }
            }
        }
        // Add layer to manager
        addToManager(data);
    }
    return trips;
}

/*
export function filterByKeywords(trips) {

    // Add to markKeywords
    if (input.val() !== "") {
        let inputStr = input.val().split(' ');
        for (let i = 0; i < inputStr.length; ++i) {
            if (inputStr[i].toUpperCase() != "AND" && inputStr[i].toUpperCase() != "OR" && inputStr[i].toUpperCase() != "NOT") {
                underlineKeywords.push(inputStr[i]);
            }
        }
    }

    for (let i = 0; i < trips.length; ++i) {
        let trip = trips[i];

        let keywords = trip.keywords,
            narratives = trip.narratives;

        for (let j = 0; j < narratives.length; ++j) {
            if (narratives[j] !== "none") {
                if (boolKeywords(keywords[j]) != undefined) {
                    if (!boolKeywords(keywords[j])) {
                        if (narratives[j].split(' ')[0] !== "Updated") {
                            narratives[j] = "none";
                            keywords[j] = [];
                        }
                    }
                }
            }
        }
    }
    return trips;
}*/

function boolKeywords(keywords) {
    let bool = true;
    if (input.val() !== "") {
        let inputStr = input.val().split(' ');
        for (let i = 0; i < inputStr.length; ++i) {
            let word = inputStr[i].toString();
            if (i === 0) {
                if (word.toUpperCase() !== "AND" && word.toUpperCase() !== "OR" && word.toUpperCase() !== "NOT") {
                    bool = findKeywords(word, keywords);
                } else {
                    alert("Error, incorrect search format, please try again");
                    return;
                }
            } else if (i > 0) {
                if (word.toUpperCase() !== "AND" && word.toUpperCase() !== "OR" && word.toUpperCase() !== "NOT") {
                    let logical = inputStr[i - 1].toUpperCase();
                    if (logical.toUpperCase() === "AND" || logical.toUpperCase() === "NOT" || logical.toUpperCase() === "OR" ) {
                        
                        switch (logical) {
                            case 'AND':
                                bool = (findKeywords(word, keywords) && bool);
                                break;
                            case 'OR':
                                bool = (findKeywords(word, keywords) || bool);
                                break;
                            case 'NOT':
                                bool = (!findKeywords(word, keywords) && bool);
                                break;
                        }
                    } else {
                        alert("Incorrect search format, please try again.");
                        return;
                    }
                }
            }
        }
    }

    return bool;
}

// Find keyword in the array of keywords.
function findKeywords(w, keywords) {
    var pos = keywords.indexOf(w);
    return (pos != -1 ) ? true : false;
}

function displayBarChart(keywordData) {

    let width = $(keywordSVG).width(),
        barHeight = 12,
        offset = 200;
    // Assign current data
    var words = keywordData;
    // Get min and max values
    var min = words[words.length - 1].frequency,
        max = words[0].frequency;
    // Start d3 js draw keyword barchart.
    var scale = d3.scale.linear().domain([min, max + max + offset]).range([0, width]);
    // Show only top 100 to reduce performance cost.
    var displayData = words.slice(0, 100);
    // Select svg.
    var barchart = d3.select(keywordSVG);
    
    // Remove every thing inside svg.
    barchart.selectAll('*').remove();
    var binding = barchart.selectAll('g')
                    .data(displayData, function (d) {
                        return d.word;
                    });
    // Set color of barchart.
    /*
    var color = d3.scale.linear()
                    .domain([.9, .7, .5, .3, .1])
                    .range(["#225ea8", "#1d91c0", "#41b6c4", "#7fcdbb", "#c7e9b4"]);*/
    
    var color = undefined;
    if (geovisuals.modes.analysis === 'trip') {
        color = d3.scale.linear()
            .domain([.9, .7, .5, .3, .1])
            .range(["#225ea8", "#1d91c0", "#41b6c4", "#7fcdbb", "#c7e9b4"]);
    } else {
        color = d3.scale.linear()
            .domain([.9, .7, .5, .3, .1])
            .range(["#bd0026", "#f03b20", "#fd8d3c", "#feb24c", "#fed976"]);
    }
    

    var g = binding.enter()
                .append("g");

    g.append('line')
        .style('stroke', '#e0e0e0')
        .attr('x1', 0)
        .attr('y1', barHeight / 2)
        .attr('x2', width)
        .attr('y2', barHeight / 2);

    g.append("rect")
        .attr("x", 0)
        .attr("width", function(d) {
            return scale(d.frequency);
        })
        .attr("height", barHeight - 1)
        .style("fill", function (d) {
            return color(normalize(d.frequency, min, max));
        })
        .style("stroke", '#222222')
        .style("stroke-width", '1px');

    g.append("text")
        .attr("x", function(d) {
            return scale(d.frequency) + 10;
        })
        .attr("y", barHeight / 2 + 3)
        .text(function (d) {
            return d.word + ' (' + d.frequency + ')';
        })
        .style('font-size', '12px')
        .style("fill", "#000");

    g.on("mouseover", mouseover)
     .on("mouseout", mouseout)
     .on('click', click);

    binding.transition()
        .duration(2000)
        .attr("transform", function (d, i) {
            return "translate(0," + i * barHeight + ")";
        });

    return;   
}

function mouseover(d, i) {
    // Show all keywords
    d3.select(this).selectAll("text").style("fill", 'aquamarine');
    d3.select(this).style('cursor', 'cell');
}

function mouseout(d, i) {
    d3.select(this).selectAll("text").style("fill", '#000');
}

function click(d, i) {

    if (input.val() == "" || input.val() == " ") {
        input.val(d.word);
        geovisuals.update();
        return;
    } else {
        input.val(input.val() + ' AND ' + d.word);
        geovisuals.update();
        return;
    }
    return;
}

function normalize(val, min, max) {
    return (val - min) / (max - min);
}

function setSearchButtonEvent() {
    button.off().on('click', function () {
        geovisuals.update();
    });
    return;
}