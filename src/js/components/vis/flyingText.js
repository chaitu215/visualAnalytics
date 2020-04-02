/**
 * 
 * @param {*} container 
 * @param {*} keywords 
 */

/*
export var TextAnim = undefined;

export default function ()
{
    var container = $('#video-player-container');

    var width = container.width(),
        height = container.height();

    var svg = d3.select('#' + container.attr('id'))
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    TextAnim = svg;
    return;
}

export function update (word)
{
    var container = $('#video-player-container');
    var width = container.width();
    var height = container.height();
    // var transition = d3.transition().delay(8000).attr("x", 0);

    // Binding new keywords
    var binding = TextAnim;
                //    .data(keywords, function (d) {
                //        return d;
                //    });

    // Exit
    binding.remove();

    // Enter
    var g = binding.enter()
                .append('g');

    // Add text in random height
    g.append('text')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#fff')
            .attr('x', width - 50)
            .attr('y', Math.floor(Math.random() * height))
            .text(word)
            .transition()
                .delay(8000)
                .attr("x", 0)
                .on("end", () => {
                    console.log('done');
                });

    return;
}*/


export default function (keywords)
{
    var container = $('#video-player-container');
    
    var width = container.width() - 50;
    var height = container.height();

    // Adding span in random height position
    var span = $('<span/>', {
        class: 'flying-text'
    }).css({
        color: '#fff',
        top: Math.floor(Math.random() * height)
    }).html(keywords);

    container.append(span);

    var horiz = Math.random() * (width - (width/2)) + (width/2);
    /*
    console.log(horiz);
    d3.selectAll('.flying-text')
        .attr("transform", "translate(-" + horiz + ",0)");*/

    
    span.clearQueue()
        .stop()
        .animate({
            right: horiz
        }, 10000, () => {
            span.remove();
        });

    /*
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }*/
        

    return;
}

