import { dom } from '../../component';
import { default as getSentimentSeries } from '../utils/sentiment';

export default function (streets) {
    // Empty sentiment chart
    dom.sentimentChart.empty();
    // Preprocess sentiment series data
    streets = getSentimentSeries(streets);
    return drawStackedBarchart(dom.sentimentChart, streets);
}

function drawStackedBarchart (container, data) {

    data = sortByKeys(data);
    var keys = getKeySeries(data);
    var margin = {top: 20, right: 30, bottom: 30, left: 30},
        width = container.width(),
        height = container.height() - margin.top - margin.bottom;

    var xScale = d3.scale.ordinal()
                .domain(data.map(function(d) { return d.date; }))
                .rangeRoundBands([margin.left, width - margin.right], .2);
    var yScale = d3.scale.linear()
                .rangeRound([height - margin.bottom, margin.top]);

    var color = d3.scale.ordinal().range(["#a6cee3","#1f78b4","#b2df8a","#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]);

    var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .innerTickSize([0]);
    
    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickFormat(d3.format(".2s")); 

    var stack = d3.layout.stack();

    var svg = d3.select("#" + container.attr('id')).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //data.sort(function(a,b) { return +a.total - +b.total;});
    var segmentsStacked = getKeySeries(data);

    var stacked = stack(makeData(segmentsStacked, data));
    console.log(stacked);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("sentiment score");

    var street = svg.selectAll(".street")
        .data(stacked)
      .enter().append("g")
        .attr("class", "street")
        .style("fill", function(d, i) { return color(i); });

    var rectangles = street.selectAll("rect")
        .data(function(d) {
          // console.log("array for a rectangle");
          return d; })  // this just gets the array for bar segment.
        .enter().append("rect")
          .attr("width", xScale.rangeBand());

    transitionCount()
    return drawLegend();

    function transitionPercent() {

        yAxis.tickFormat(d3.format("%"));
        stack.offset("expand");  // use this to get it to be relative/normalized!
        var stacked = stack(makeData(segmentsStacked, data));
        // call function to do the bars, which is same across both formats.
        transitionRects(stacked);
      }

    function makeData(segmentsStacked, data) {
        return segmentsStacked.map(function(street) {
            return data.map(function(d) {
                return {x: d["date"], y: +d[street], street: street};
            })
        });
    }

    function transitionCount() {
        yAxis.tickFormat(d3.format(".2s")); // for the stacked totals version
        stack.offset("zero");
        var stacked = stack(makeData(segmentsStacked, data));
        transitionRects(stacked);
    }

    function transitionRects(stacked) {
        // this domain is using the last of the stacked arrays, which is the last illness, and getting the max height.
        let min = d3.min(stacked[stacked.length-1], function(d) { return d.y0 + d.y; });
        let max = d3.max(stacked[stacked.length-1], function(d) { return d.y0 + d.y; });

        yScale.domain([-100, 100]);
        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis)
            .attr("transform", "translate(-20," + yScale(0) + ")")
            .selectAll("text")
            .attr("dy", "1em")
            .attr("dx", "1em")
            .attr("transform", "translate(0,20) rotate(270)")
            .style("text-anchor", "end");

        // attach new fixed data
        var street = svg.selectAll(".street")
            .data(stacked);

        // same on the rects
        street.selectAll("rect")
            .data(function(d) {
                //console.log("array for a rectangle");
                return d;
            })  // this just gets the array for bar segment.

        svg.selectAll("g.street rect")
            .transition()
            .duration(250)
            .attr("x", function(d) {
                return xScale(d.x);
            })
            .attr("y", function(d) {
                return yScale(d.y0); 
            }) //
            //.style('stroke', '#000')
            //.style('stroke-width', 1)
            .attr("height", function(d) {
                return Math.abs(yScale(d.y0) - yScale(d.y)); 
            })
            .transition().duration(400); // height is base - tallness

        svg.selectAll(".y.axis").transition().call(yAxis);
    }

    function drawLegend() {
        let result = [];
        var labels = keys;
        var legend = svg.selectAll(".legend")
            .data(color.domain().slice()) // what do you think this does?
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + Math.abs((i-8) * 15) + ")"; });
            // Added the absolute value and transition. I reversed the names, so that I can continue to use category20(), but have health as green to make it stand out.
    
        legend.append("rect")
            .attr("x", width  - margin.left - 200)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);
            //.style("stroke", "#000")
            //.style("stroke-width", 1);
        var c = ["#a6cee3","#1f78b4","#b2df8a","#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"];
        legend.append("text")
            .attr("x", width  - margin.left - 200 + 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d, i) { 
                let street = {
                    color: c[i],
                    name: labels[i]
                }
                result.push(street);
                return labels[i]; 
            });

        return result;
    }

}

function getKeySeries (data) {
    var keys = [];
    for (var key in data[0]) {
        if (key !== 'date') {
            keys.push(key);
        }
    }
    return keys;
}

function sortByKeys (data) {

    let sortedData = [];
    data.forEach (item => {
        const ordered = {};
        Object.keys(item).sort().forEach( function(key) {
            ordered[key] = item[key];
        });
        sortedData.push(ordered);
    });
    return sortedData;
}