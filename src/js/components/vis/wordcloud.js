import {default as cloud} from 'd3-cloud'

export default function (container, data, fillcolor) {

    container.empty();

    var width = container.width(),
    height = container.height();

    // Wordcloud options.
    var rescale = 50,
        fontFamily = 'sans-serif',
        fill = d3.scale.category20c();

    
    var color = d3.scale.linear()
                    .domain([36, 29, 23, 15, 10])
                    .range(["#225ea8", "#1d91c0", "#41b6c4", "#7fcdbb", "#c7e9b4"]);


    cloud().size([width, height])
        .words(Object.keys(data).map(function(d) {
            return {
                text: d,
                size: data[d]
            }
        }))
        .padding(0)
        .rotate(function () { return 0; })
        .font(fontFamily)
        .fontSize(function(d) { return d.size })
        .on("end", draw)
        .start();
    
        
    function draw(data) {
        
        var svg = d3.select('#' + container.attr('id')).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("background-color", "black")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        var wordcloud = svg.selectAll("text")
                            .data(data);
        wordcloud.enter()
            .append("text")
            .style("font-family", fontFamily)
            .style("font-size", 1) // set this to 1
            //.style('font-weight', 'bold')
            .style('opacity', 0.7)
            .style("fill", function(d, i) {
                
                // position
                /*
                let pos = selected_keywords.map((x) => {
                    return x.word;
                }).indexOf(d.text);*/
                
                return fillcolor
                //return (pos !== -1) ? selected_keywords[pos].color : fillcolor;

            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.text;
            })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .on("click", click)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        wordcloud.transition()
            .duration (600)
            .style ("font-size", function(d) {
                return d.size + "px";
            })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);
    }

    function click(d, i) {
        console.log('click do somethings');
    }

    function mouseover(d, i) {
        d3.select(this).style({
                "font-weight": "bold",
                "cursor": 'cell'
        });
    }

    function mouseout(d, i) {
        d3.select(this).style({
            "font-weight": "normal"
        });
    }

    return;
}