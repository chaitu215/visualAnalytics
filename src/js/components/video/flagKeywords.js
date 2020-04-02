/**
 * Draw flag keywords over video slider bar
 * @param {*} slider 
 * @param {*} trip 
 */
export function draw_flag_keywords(slider, trip)
{
    console.log(trip.times.length);

    // Add new container over slider
    var flag_container = get_flag_container();
    slider.append(flag_container);

    var groups = 24;
    var data = prepare_data(trip, groups);
    var width = flag_container.width();
    var height = flag_container.height();
    // Create grid size
    var grid_size = Math.floor(width / groups);

    var color_buckets = 5;
    var colors = ["#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"];

    // Generate svg canvas
    var svg = d3.select("#" + flag_container.attr('id')).append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g");
    
    /*
    var colorScale = d3.scale.quantile()
          .domain([0, color_buckets - 1, d3.max(data, function (d) { return d.sdps; })])
          .range(colors);
    
    var y = d3.scale.linear().range([height, 0]);
    y.domain([0, d3.max(data, function(d) { return d.sdps; })]);*/ 

    // Initialize swaping height
    var high = true;

    var flags = svg.selectAll(".hour")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("class", "flag")

    flags.append("line")
        .attr("x1", function(d) { if (d.keyword !== 'none') { return (d.group - 1) * grid_size; }})
        .attr("y1", 500)
        .attr("x2", function(d) { if (d.keyword !== 'none') { return (d.group - 1) * grid_size; }})
        .attr("y2", function(d) { 
            if (d.keyword !== 'none') {
                if (high) {
                    high = !high;
                    return 0 ;
                } else {
                    high = !high;
                    return 20;
                }
            } else {
                return 500;
            }
        })
        .style("stroke-width", 2)
        .style("stroke", "red")
        .style("fill", "none");
    
    high = true;
    flags.append("rect")
        .attr("x", function(d) { if (d.keyword !== 'none') { return (d.group - 1) * grid_size; }})
        .attr("y", function(d) { 
            if (d.keyword !== 'none') {
                if (high) {
                    high = !high;
                    return 0;
                } else {
                    high = !high;
                    return 20;
                }
            } else {
                return 500;
            }
        })
        .attr("class", "hour bordered")
        .attr("width", 12)
        .attr("height", 15)
        .style("cursor", "pointer")
        .style("fill", '#7f0000');

    /*cards.select("title").text(function(d) { return d.keyword; });*/
    high = true;
    flags.append("text")
        .attr("x", function(d) { if (d.keyword !== 'none') { return (d.group - 1) * grid_size; }})
        .attr("y", function(d) { 
            if (d.keyword !== 'none') {
                if (high) {
                    high = !high;
                    return 0 + 12;
                } else {
                    high = !high;
                    return 20 + 12;
                }
            } else {
                return 500;
            }
        })
        .style("cursor", "pointer")
        .style('font-size', '11')
        .attr("text-anchor", "start")
        .attr('fill', '#fff')
        .text(function (d) {
            return " " + d.keyword + " "
        });
    
    flags.selectAll('rect')
        .attr("width", function(d) {return this.parentNode.getBBox().width;});

    return;
}

/**
 * Generate keyword flag container
 */
function get_flag_container()
{
    return $('<div/>', {
        id: 'flag-keywords-container'
    }).css({
        position: 'absolute',
        width: '100%',
        height: '40px',
        background: 'none',
        left: '0',
        bottom: '20px'
    });
}

/**
 * Prepare datasets
 * @param {*} trip 
 * @param {*} groups 
 */
function prepare_data(trip, groups)
{

    var i,j, temp_array;
    var chunk = Math.floor(trip.times.length / groups);
    var result = [];
    var group = 0;
    for (i = 0, j = trip.times.length; i < j; i += chunk) {

        temp_array = trip.keywords.slice(i, i + chunk);
        let keyword = get_top_keyword(temp_array);
        let count_narrative = 0;
        temp_array.forEach( arr => {
            if (arr.length > 0) {
                count_narrative++;
            }
        });

        // Create item
        let item = {
            group: group + 1,
            keyword: keyword,
            sdps: count_narrative
        }

        result.push(item);
        group++;
    }

    return result;
}

/**
 * Finding top keyword
 * @param {*} keywords 
 */
function get_top_keyword(keywords)
{
    let arr = [];
    for (let i = 0; i < keywords.length; ++i) {
        let words = keywords[i];
        words.forEach( word => {
            let pos = arr.map( (x) => {
                return x.word;
            }).indexOf(word);
            (pos == -1) ? arr.push({ word: word, freq: 1 }) : arr[pos].freq += 1;
        });
    }
    // Sort arrays
    arr.sort( (a,b) => b.freq - a.freq );
    return (arr.length > 0) ? arr[0].word : 'none';
}