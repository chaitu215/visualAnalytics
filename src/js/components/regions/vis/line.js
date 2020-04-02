import { dom, getImagePath, createImageElement, addMapLayer} from '../../component';
import { default as normalize } from '../utils/normalize';
import Sentiment from 'sentiment';
import {default as Mark} from 'mark.js';
import { getCurrentMap } from '../../../main/geovisuals';
import { default as layers } from '../map/layers';

export var currentRegions = undefined;
export var currentIndex = undefined;
export var sentimentOptions = { extras: {} };

export default function line (regions, index) {
    
    currentRegions = regions;
    currentIndex = index;

    //dom.sdpContainer.empty();
    //dom.sdpContainer.empty();
    $("#sdp").hide();
    $("#sdp").nextAll().remove();

    // Add new dictionary option
    let newDictionary = getNewDictionary();
    dom.sdpContainer.append(newDictionary);

    dom.sentimentChart.empty();
    let canvas = createCanvas(dom.sentimentChart);
    let ctx = canvas[0].getContext('2d');

    let datasets = getData(regions, index);
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        data: datasets,
        // Configuration options go here
        options: getOptions(chart)
    });

    addClickEvent(canvas, chart);

    return datasets;
}

export function addSentimentOptions (keyword, score) {
    return sentimentOptions.extras[keyword.toString()] = parseInt(score);
}

export function resetSentimentOptions () {
    return sentimentOptions = { extras: {} };
}

function createCanvas (container) {
    
    let canvas = $('<canvas/>').css({
        width: '50%',
        height: '100%'
    });

    container.append(canvas);
    return canvas;
}

function getData (regions, list) {
    
    let dates = [], datasets = [];
    
    let colors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    }

    // Get all date as labels
    regions.forEach( region => {
        if (list.indexOf(region.index) !== -1) {
            // Get unique date
            for (var i = 0, len = region.sentiments.length; i < len; ++i) {
                let date = region.dates[i];
                let pos = dates.indexOf(date);
                if (pos === -1) {
                    dates.push(date);
                }
            }
        }
    });

    var dateSortAscending = function (a, b) {
        let date1 = new Date(a);
        let date2 = new Date(b);
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 0;
    };

    dates.sort(dateSortAscending);

    let max = 0, min = 1;
    var colorNames = Object.keys(colors);
    // Get initialize sentiment score
    regions.forEach( region => {

        if (list.indexOf(region.index) !== -1) {

            let regionName = 'Region '+ region.index;
            let data = [];
            let radius = [];
            let keywords = [];
            let narratives = [];
            let points = [];
            let images = [];
            let geometrys = [];
            
            let pointBackgroundColors = [], pointBorderColors = [], selections = [];
            var colorName = colorNames[datasets.length % colorNames.length];
            var newColor = colors[colorName];
            
            // initialize data
            dates.forEach( date => {
                data.push(0);
                radius.push(0);
                keywords.push([]);
                narratives.push([]);
                points.push([]);
                images.push([]);
                geometrys.push([]);
            });

            // get sentiment score by dates (important)
            for (let i = 0, len = region.sentiments.length; i < len; ++i) {
                // get street data
                let date = region.dates[i];
                // Modify sentiment 
                let sentiment = new Sentiment();
                let score = sentiment.analyze(region.narratives[i], sentimentOptions).score;
                //let score = street.sentiments[i];
                let keyword = region.keywords[i];
                let pos = dates.indexOf(date);

                data[pos] += score;
                radius[pos] += 1;
                keywords[pos].push(keyword);
                geometrys[pos].push(region.geometry);
                narratives[pos].push(region.narratives[i]);
                points[pos].push(region.locations[i]);

                // Create images left and right
                let pathLeft = getImagePath(region.videos[i].nameLeft, region.videos[i].timeLeft);
                let pathRight = getImagePath(region.videos[i].nameRight, region.videos[i].timeRight);
                images[pos].push({
                    left: pathLeft, right: pathRight
                });
                pointBackgroundColors.push(newColor);
                pointBorderColors.push(newColor);
                selections.push(false);
            }

            radius.forEach( rad => {
                if (max < rad) {
                    max = rad;
                }
            });

            // create data
            let dataset = {
                label: regionName,
                data: data,
                backgroundColor: newColor,
                borderColor: newColor,
                borderWidth: 2,
                fill: false,
                borderDash: [3, 3],
                pointBorderColor: pointBorderColors,
                pointBackgroundColor: pointBackgroundColors,
                // This use to normalize radius
                rad: radius,
                keywords: keywords,
                narratives: narratives,
                points: points,
                select: selections,
                images: images,
                geometrys: geometrys
            }
            datasets.push(dataset);
        }
    });

    // Normalize radius values
    datasets.forEach( d => {
        

        for (let i = 0; i < d.rad.length; ++i) {
            d.rad[i] = normalize(d.rad[i], [min, max], [2, 30]);
        }

        d.pointRadius = d.rad;
        d.pointHoverRadius = d.rad;
    });

    return {
        labels: dates,
        datasets: datasets
    }
}

function getOptions (chart) {
    return {
        responsive:true,
        maintainAspectRatio: false,
        legend: {
            position: 'top'
        },
        hover: {
            mode: 'index'
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date Time'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Sentiment Score'
                }
            }]
        },
        title: {
            display: true,
            text: 'Sentiment Score by Selected Regions'
        }
    };
}

function addClickEvent (canvas, chart) {
    canvas.on('click', (e) => {
        // Get only one active point
        var activePoint = chart.getElementAtEvent(e);
        if (activePoint[0]) {
            // index of datasets
            var idx = activePoint[0]._index;
            var datasetIndex = activePoint[0]._datasetIndex;
            var chartData = activePoint[0]._chart.data;

            // Change border color
            if (!chartData.datasets[datasetIndex].select[idx]) {
                console.log(chartData.datasets[datasetIndex]);
                let date = chartData.labels[idx];
                chartData.datasets[datasetIndex].pointBorderColor[idx] = '#000';
                chartData.datasets[datasetIndex].select[idx] = true;
                chart.update();

                // Create selected data
                var name = chartData.datasets[datasetIndex].label;
                var narratives = chartData.datasets[datasetIndex].narratives[idx];
                var keywords = chartData.datasets[datasetIndex].keywords[idx];
                var points = chartData.datasets[datasetIndex].points[idx];
                var images = chartData.datasets[datasetIndex].images[idx];
                var bg = chartData.datasets[datasetIndex].backgroundColor;
                openDetailView();
                let id = 'Gal-'+ datasetIndex + '-' + idx;
                showImageGallery(images, narratives, keywords, points, id, name, bg, date);
            } else {
                let originalColor = chartData.datasets[datasetIndex].backgroundColor;
                chartData.datasets[datasetIndex].pointBorderColor[idx] = originalColor;
                chartData.datasets[datasetIndex].select[idx] = false;
                chart.update();
                let id = 'Gal-'+ datasetIndex + '-' + idx;
                removeImageGallery(id);
            }
        }
    });
}

function openDetailView () {
    dom.visContainer.css({ width : "calc(100% - 45%)" });
    dom.sdpContainer.css({ width: "30%" });
    return;
}

// Create image gallery
function showImageGallery (images, narratives, keywords, points, id, name, color, date) {
    //console.log(images);
    // 1. Create container
    let container = $('<div/>', {
        id: id
    }).css({
        width: '100%',
        height: 'auto',
        'max-height': '32%',
        'border': '2px solid #525252',
        'border-radius': '5px',
        'margin-top': '2px',
        'overflow-x': 'hidden',
        'overflow-y': 'auto',
        'text-align': 'center'
    });
    dom.sdpContainer.append(container);
    
    let streetLabel = getStreetlabel(name, color, date);
    container.append(streetLabel);

    // 1. rank sentiment score by keywords
    /*
    let rankedData = rankBySentimentScore(keywords, points, narratives);
    console.log(rankedData);*/

    
    let options = getStreetOptions(keywords);
    container.append(options);

    
    let sentimentRank = getSentimentRanking(keywords, points, narratives, container, images);
    container.append(sentimentRank);
    

    //let gallery = getImageGallery(images, points, narratives);
    //container.append(gallery);

    return;
}

function getDictionary (word, score) {
    let container = $('<div/>').css({
        'margin-top': '2px',
        'margin-bottom': '2px',
        'font-size': '12px',
        'border': '2px solid #525252',
        'border-radius': '5px',
        'padding-left': '5px',
        'color': '#fff',
        'background': '#525252'
    }).html('<center><font color="yellow"><strong>Update Selected Keyword</strong></font></center>');

    // Create bootstrap form
    let form = $('<form/>').css({ 
        'display': 'table', 
        'border-spacing': '2px',
        'margin': '0 auto'
    });

    // Keyword contai
    let keywordsContainer = $('<div/>').css({
        width: '100%',
        display: 'table-row'
    });
    let keywordLabel = $('<label/>').css({ 
        display: 'table-cell' 
    }).html('<strong> KEYWORD: </strong>');
    let keywordValue = $('<label/>').css({ 
        display: 'table-cell' 
    }).html('<font color="yellow"><strong>' + word + '</strong></font>');
    let keywordSpace = $('<div/>').css({ display: 'table-cell', width: '100px' });
    keywordsContainer.append(keywordLabel).append(keywordValue).append(keywordSpace);

    // Type selection
    let typeContainer = $('<div/>').css({
        width: '100%',
        display: 'table-row'
    });
    // type selector
    let typeLabel = $('<label/>').css({ 
        display: 'table-cell' 
    }).html('<strong> TYPE: </strong>');
    let typeSelector = $('<select/>').css({ 
        background: '#ffffff',
        border: '1px solid #000',
        width: '125px',
        display: 'table-cell' 
    });
    // type options
    let option1 = $('<option/>', { value: 'positive' }).html('positive');
    let option2 = $('<option/>', { value: 'negative' }).html('negative');
    typeSelector.append(option1).append(option2);

    // Set type selector associated with sentiment types
    (score < 0) ? typeSelector.val('negative') : typeSelector.val('positive');
    
    let buttonContainer = $('<div/>').css({
        display: 'table-cell', 
        width: '200px', 
        'text-align': 'center'
    });
    let updateButton = $('<button/>', {
        type: 'button',
        class: 'btn btn-primary'
    }).css({
        padding: 0,
        width: '100px',
        'font-size': '12px',
    }).html('<strong>UPDATE</strong>');
    buttonContainer.append(updateButton);
    typeContainer.append(typeLabel).append(typeSelector).append(buttonContainer);

    // Score selector
    let scoreContainer = $('<div/>').css({
        width: '100%',
        display: 'table-row'
    });
    let scoreLabel = $('<label/>').css({ 
        display: 'table-cell' 
    }).html('<strong> SCORE: </strong>');
    let scoreSelector = $('<select/>').css({ 
        background: '#ffffff',
        border: '1px solid #000',
        width: '100%',
        display: 'table-cell' 
    });
    let scoreSpace = $('<div/>').css({ display: 'table-cell', width: '100px', });

    if (score < 0) {
        // Negative score
        for (let i = -5; i < 0; ++i) {
            let option = $('<option/>', { value: i }).html(i);
            scoreSelector.append(option);
        }
    } else {
        // Positive score
        for (let i = 5; i >= 0; --i) {
            let option = $('<option/>', { value: i }).html(i);
            scoreSelector.append(option);
        }
    }

    scoreContainer.append(scoreLabel).append(scoreSelector).append(scoreSpace);
    scoreSelector.val(score);

    // Add everything to a form
    form.append(keywordsContainer);
    form.append(typeContainer);
    form.append(scoreContainer);

    // Add form to main container
    container.append(form);

    updateButton.on('click', function () {
        addSentimentOptions(word, scoreSelector.val());
        line(currentRegions, currentIndex);
    });

    typeSelector.on('change', () => {
        if (typeSelector.val() == 'positive') {
            // Clear current selector and add a positive one
            scoreSelector.empty();
            for (let i = 5; i >= 0; --i) {
                let option = $('<option/>', { value: i }).html(i);
                scoreSelector.append(option);
            }
        } else {
            // Clear current selector and add a negative one
            scoreSelector.empty();
            for (let i = -5; i < 0; ++i) {
                let option = $('<option/>', { value: i }).html(i);
                scoreSelector.append(option);
            }
        }
    });

    return container;
}

function getNewDictionary () {

    // Main container
    let container = $('<div/>').css({
        'margin-top': '2px',
        'margin-bottom': '2px',
        'font-size': '12px',
        //'text-align': 'center',
        'border': '2px solid #525252',
        'border-radius': '5px',
        'padding-left': '5px',
        'color': '#fff',
        'background': '#525252'
    }).html('<center><font color="yellow"><strong>Add Keyword to Dictionary</strong></font></center>');

    // Create bootstrap form
    let form = $('<form/>').css({ 
        'display': 'table', 
        'border-spacing': '2px',
        'margin': '0 auto'
    });

    //let form_row_2 = $('<div/>', { class: 'form-group row' });

    // Keyword container
    let keywordsContainer = $('<div/>').css({
        width: '100%',
        display: 'table-row'
    });

    let keywordLabel = $('<label/>').css({ 
        display: 'table-cell' 
    }).html('<strong> KEYWORD: </strong>');

    let keywordInput = $('<input/>', { type: 'text', placeholder: 'New keyword' 
    }).css({
        background: '#ffffff',
        border: '1px solid #000',
        width: '100%',
        display: 'table-cell',
        'border-radius': '4px',
        'padding-left': '8px'
    });
    let keywordSpace = $('<div/>').css({ display: 'table-cell', width: '100px' });
    keywordsContainer.append(keywordLabel).append(keywordInput).append(keywordSpace);

    // Type selection
    let typeContainer = $('<div/>').css({
        width: '100%',
        display: 'table-row'
    });
    // type selector
    let typeLabel = $('<label/>').css({ 
        display: 'table-cell' 
    }).html('<strong> TYPE: </strong>');
    let typeSelector = $('<select/>').css({ 
        background: '#ffffff',
        border: '1px solid #000',
        width: '100%',
        display: 'table-cell' 
    });
    // type options
    let option1 = $('<option/>', { value: 'positive' }).html('positive');
    let option2 = $('<option/>', { value: 'negative' }).html('negative');
    typeSelector.append(option1).append(option2);
    let addButtonContainer = $('<div/>').css({ 
        display: 'table-cell', 
        width: '200px', 
        'text-align': 'center'
    });
    let addButton = $('<button/>', {
        type: 'button',
        class: 'btn btn-success'
    }).css({
        padding: 0,
        width: '100px',
        'font-size': '12px',
    }).html('<strong>ADD</strong>');
    addButtonContainer.append(addButton);

    typeContainer.append(typeLabel).append(typeSelector).append(addButtonContainer);

    // Score selection
    let scoreContainer = $('<div/>').css({
        width: '100%',
        display: 'table-row'
    });
    // Score selector
    let scoreLabel = $('<label/>').css({ 
        display: 'table-cell' 
    }).html('<strong> SCORE: </strong>');
    let scoreSelector = $('<select/>').css({ 
        background: '#ffffff',
        border: '1px solid #000',
        width: '100%',
        display: 'table-cell' 
    });
    let scoreSpace = $('<div/>').css({ display: 'table-cell', width: '100px', });

    // Set default score options
    for (let i = 5; i >= 0; --i) {
        let option = $('<option/>', { value: i }).html(i);
        scoreSelector.append(option);
    }
    scoreContainer.append(scoreLabel).append(scoreSelector).append(scoreSpace);

    typeSelector.on('change', () => {
        if (typeSelector.val() == 'positive') {
            // Clear current selector and add a positive one
            scoreSelector.empty();
            for (let i = 5; i >= 0; --i) {
                let option = $('<option/>', { value: i }).html(i);
                scoreSelector.append(option);
            }
        } else {
            // Clear current selector and add a negative one
            scoreSelector.empty();
            for (let i = -5; i < 0; ++i) {
                let option = $('<option/>', { value: i }).html(i);
                scoreSelector.append(option);
            }
        }
    });

    // Score selection

    // Add to form
    form.append(keywordsContainer);
    form.append(typeContainer);
    form.append(scoreContainer);
    // Add everyting to a from
    container.append(form);

    addButton.on('click', function () {
        if (!keywordInput.val().replace(/\s+/, '').length) {
            alert('No input keyword');
        } else {
            if (scoreSelector.val() > 5 || scoreSelector.val() < -5) {
                alert('Dictionary accept sentiment score between -5 and 5');
                (typeSelector.val() == 'positive') ? scoreSelector.val(5) : scoreSelector.val(-5); 
            } else {
                addSentimentOptions(keywordInput.val(), scoreSelector.val());
                console.log(currentRegions);
                line(currentRegions, currentIndex);
            }
        }
    });
    return container;
}

function getSentimentRanking (keywords, points, narratives, div, images) {

    function getSentimentColor(score) {
        let color = '#fff';
        switch (score) {
            case -5: color = '#d73027'; break;
            case -4: color = '#f46d43'; break;
            case -3: color = '#fdae61'; break;
            case -2: color = '#fee08b'; break;
            case -1: color = '#ffffbf'; break;
            case 0: color = '#ffffff'; break;
            case 1: color = '#d9ef8b'; break;
            case 2: color = '#a6d96a'; break;
            case 3: color = '#66bd63'; break;
            case 4: color = '#1a9850'; break;
            case 5: color = '#1b7837'; break;
        }

        return color;
    }
    
    let container = $('<div/>').css({ 'overflow': 'auto' });

    var data = processData(keywords, 10, narratives, points, images);
    // reverse negative
    data.negative.reverse();
    // remove 0 score
    var i = data.negative.length
    while (i--) {
        if (data.negative[i].score === 0) { 
            data.negative.splice(i, 1);
        }
    }
    // remove 0 score
    var j = data.positive.length
    while (j--) {
        if (data.positive[j].score === 0) { 
            data.positive.splice(j, 1);
        }
    }

    var table = $('<table/>', {
        class: 'table table-bordered table-condensed'
    }).css({ 'font-size': '12px' });

    var thead = $('<thead/>', {
        class: 'thead-light'
    }).html('<tr><th style="padding: 0;">Positive</th><th style="padding: 0;">Negative</th></tr>');
    var tbody = $('<tbody/>').css({ 'margin-top': '2px' });

    for (let i = 0; i < data.positive.length; ++i) {
        let tr = $('<tr/>');

        let pos = $('<td/>', { class: 'sentiment-keyword' });
        if (data.positive[i]) {
            pos.css({ padding: 0, background: getSentimentColor(data.positive[i].score) })
                    .html(data.positive[i].word + ' (' + data.positive[i].freq + ')');
        }

        let neg = $('<td/>', { class: 'sentiment-keyword' });
        if (data.negative[i]) {
            neg.css({ padding: 0, background: getSentimentColor(data.negative[i].score) })
                    .html(data.negative[i].word + ' (' + data.negative[i].freq + ')');
        }

        tr.append(pos).append(neg);

        /*
        pos.hover( function () {
            pos.css({ border: '1px solid #000' });
        }, function () {
            pos.css({ border: '1px solid #fff' });
        });*/

        /*
        neg.hover( function () {
            neg.css({ border: '1px solid #000' });
        }, function () {
            neg.css({ border: '1px solid #fff' });
        });*/

        pos.on('click', function () {

            if (pos.hasClass('select')) {

                pos.css({ border: '1px solid #fff' }); 
                pos.removeClass('select');

                $('.sentiment-sentences').remove();

            } else {

                $('.sentiment-keyword').removeClass('select'); 
                $('.sentiment-keyword').css({ border: '1px solid #fff' });
                pos.addClass('select');
                pos.css({ border: '2px solid #000' });

                $('.sentiment-sentences').remove();
                let sentences = $('<div/>', {
                    class: 'sentiment-sentences'
                }).css({ width: '100%', height: 'auto' });

                
                let dictionary = getDictionary(data.positive[i].word, data.positive[i].score);
                sentences.append(dictionary);

                var j = 0;
                layers.sentimentPoint.clearLayers();
                data.positive[i].narratives.forEach( sentence => {

                    let sdp_container = $('<div/>').css({
                        width: '100%',
                        height: 'auto',
                        'border': '1px solid #000',
                        'border-radius': '5px',
                        'padding': '5px',
                        'margin-top': '2px'
                    });

                    //console.log(data.positive[i].images);
                    let leftImage = data.positive[i].images[j].left;
                    let rightImage = data.positive[i].images[j].right;
                    let points = data.positive[i].points[j];
                    let left = createImageElement(leftImage, 'sentiment-image', '', '');
                    let right = createImageElement(rightImage, 'sentiment-image', '', '');

                    let sentiment = new Sentiment();
                    let score = sentiment.analyze(sentence, sentimentOptions).score;

                    let sentenceContainer = $('<div/>', {
                        class: 'sentiment-sentence'
                    }).css({
                        'font-size': '12px',
                        'padding': '2px',
                        
                    }).html(sentence);
                    sdp_container.append(left).append(right);
                    add_image_slider(sentenceContainer, left, right, j);
                    sdp_container.append(sentenceContainer)
                    sentences.append(sdp_container);

                    // Marker pulse icons
                    let pulseIcon = L.icon.pulse({
                        iconSize: [10, 10],
                        color: 'red',
                        heartbeat: 1
                    });

                    // Add pulse icon to the marker
                    let marker = L.marker(points, {
                        icon: pulseIcon
                    });
                    layers.sentimentPoint.addLayer(marker);
                    addMapLayer(getCurrentMap(), layers.sentimentPoint);

                    j++;
                });
                sentences.insertAfter(div);

                var context = document.querySelectorAll(".sentiment-sentence");
                var instance = new Mark(context);
                instance.mark(data.positive[i].word);

                var bounds = layers.sentimentPoint.getBounds();
                getCurrentMap().panInsideBounds(bounds);
            }
        });

        neg.on('click', function () {

            if (neg.hasClass('select')) {
                neg.css({ border: '1px solid #fff' }); 
                neg.removeClass('select');
                $('.sentiment-sentences').remove();
            } else {

                $('.sentiment-keyword').removeClass('select'); 
                $('.sentiment-keyword').css({ border: '1px solid #fff' });
                neg.addClass('select');
                neg.css({ border: '2px solid #000' });

                $('.sentiment-sentences').remove();
                let sentences = $('<div/>', {
                    class: 'sentiment-sentences'
                }).css({ width: '100%', height: 'auto' });

                // Update dictionary
                let dictionary = getDictionary(data.negative[i].word, data.negative[i].score);
                sentences.append(dictionary);

                var j = 0;
                layers.sentimentPoint.clearLayers();
                data.negative[i].narratives.forEach( sentence => {

                    let sdp_container = $('<div/>').css({
                        width: '100%',
                        height: 'auto',
                        'border': '1px solid #000',
                        'border-radius': '5px',
                        'padding': '5px',
                        'margin-top': '2px'
                    });

                    let leftImage = data.negative[i].images[j].left;
                    let rightImage = data.negative[i].images[j].right;
                    let points = data.negative[i].points[j];
                    let left = createImageElement(leftImage, 'sentiment-image', '', '');
                    let right = createImageElement(rightImage, 'sentiment-image', '', '');

                    let sentiment = new Sentiment();
                    let score = sentiment.analyze(sentence, sentimentOptions).score;

                    let sentenceContainer = $('<div/>', {
                        class: 'sentiment-sentence'
                    }).css({
                        'font-size': '12px',
                        'padding': '2px'
                    }).html(sentence);
                    
                    sdp_container.append(left).append(right);
                    add_image_slider(sentenceContainer, left, right, j);
                    sdp_container.append(sentenceContainer)
                    sentences.append(sdp_container);

                    // Marker pulse icons
                    let pulseIcon = L.icon.pulse({
                        iconSize: [10, 10],
                        color: 'red',
                        heartbeat: 1
                    });

                    // Add pulse icon to the marker
                    let marker = L.marker(points, {
                        icon: pulseIcon
                    });
                    layers.sentimentPoint.addLayer(marker);;
                    addMapLayer(getCurrentMap(), layers.sentimentPoint);

                    j++;
                });
                sentences.insertAfter(div);

                var context = document.querySelectorAll(".sentiment-sentence");
                var instance = new Mark(context);
                instance.mark(data.negative[i].word);

                var bounds = layers.sentimentPoint.getBounds();
                getCurrentMap().panInsideBounds(bounds);
            }
        });

        tbody.append(tr);
    }

    table.append(thead).append(tbody);
       

    container.append(table);

    function processData (keywords, top, narratives, points, images) {
        let result = [];
        let sentiment = new Sentiment();
        let index = 0;
        keywords.forEach( keyword => {
            for (var i = 0; i < keyword.length; ++i) {
                var word = keyword[i];
                var score = sentiment.analyze(word, sentimentOptions).score;
                var pos = result.map( x => {
                    return x.word;
                }).indexOf(word);
                if (pos === -1) {
                    let item = {
                        word: word,
                        score: score,
                        freq: 1,
                        narratives: [],
                        points: [],
                        images: []
                    };
                    item.narratives.push(narratives[index]);
                    item.points.push(points[index]);
                    item.images.push(images[index]);
                    result.push(item);
                } else {
                    result[pos].freq++;
                    result[pos].narratives.push(narratives[index]);
                    result[pos].points.push(points[index]);
                    result[pos].images.push(images[index]);
                }
            }
            index++;
        });

        result.sort( function (a,b) {
            return b.score - a.score;
        });

        let positive = result.slice(0, top);
        let negative = result.slice(1).slice(-top)

        let final = {
            positive: positive,
            negative: negative
        }

        return final;
    }

    return container;
}

function getStreetlabel (name, color, date) {
    return $('<div/>').css({
        width: '100%',
        height: '20px',
        'background': color,
        'text-align': 'center',
        'font-size': '12px',
        'font-weight': 'bold',
        'color': '#525252'
    }).html(name + ' on ' + date);
}


function removeImageGallery (id) {
    //$('.sentiment-sentences').remove();
    return $('#' + id).remove();
}
// Create option buttons

function getStreetOptions (keywords) {
    let imageOption = $('<button/>', {
        type: 'button',
        class: 'image-option-btn'
    }).css({
        padding: 0,
        width: '50%',
        height: '25px',
        float: 'left',
        background: '#e0e0e0',
        'font-size': '12px'
    }).html('Gallery');

    let keywordOption = $('<button/>', {
        type: 'button',
        class: 'keyword-option-btn'
    }).css({
        padding: 0,
        width: '50%',
        height: '25px',
        float: 'left',
        background: '#f0f0f0',
        'font-size': '12px'
    }).html('Keywords');

    let div = $('<div/>').css({
        width: '100%',
        height: '25px'
    });

    imageOption.on('click', () => {
        $('.sentiment-gallery').show();
        $('.sentiment-keyword').hide();
        $('.image-option-btn').css({background: '#e0e0e0'});
        $('.keyword-option-btn').css({background: '#ffffff'});
    });

    keywordOption.on('click', () => {
        $('.sentiment-gallery').hide();
        $('.sentiment-keyword').show();
        $('.image-option-btn').css({background: '#ffffff'});
        $('.keyword-option-btn').css({background: '#e0e0e0'});
        console.log('Keyword option');
        console.log(keywords);
    });

    return;
}

// Image slider
function add_image_slider(container, left, right, index)
{
    //console.log(point);
    
    let slider_container = $('<div/>').css({
        width: '100%',
        height: '5%'
    });

    let slider = $('<input/>', {
        type: 'range',
        min: -10,
        value: 0,
        max: 10,
        class: 'sentiment-slider'
    });

    slider.on('input', () => { 

        let srcLeft = left.src.split('-')[left.src.split('-').length-1];
        let currentLeft = left.src.split('-');

        let srcRight = right.src.split('-')[right.src.split('-').length-1];
        let currentRight = right.src.split('-');

        let indexLeft = parseInt(srcLeft.split('.')[0]) + parseInt(slider.val());
        let newLeft = indexLeft + '.jpg';

        let indexRight = parseInt(srcRight.split('.')[0]) + parseInt(slider.val());
        let newRight = indexRight + '.jpg';
        
        // Pop left
        currentLeft.pop();
        let pathLeft = "";
        currentLeft.forEach( e => {
            pathLeft += e + "-";
        });
        
        left.src = pathLeft + newLeft;

        // Pop right
        currentRight.pop();
        let pathRight = "";
        currentRight.forEach( e => {
            pathRight += e + "-";
        });
        
        right.src = pathRight + newRight;

    });

    slider_container.append(slider);
    container.append(slider_container);
    return;
}