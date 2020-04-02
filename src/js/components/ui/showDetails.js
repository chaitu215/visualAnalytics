export default function (trip, streets) {
    console.log("in details")
    const sdpContainer = $('#sdp');
    sdpContainer.empty();
    // list all points base on narratives
    for (let i = 0; i < trip.narratives.length; ++i) {
        let narrative = trip.narratives[i];
        if (narrative !== "none") {

            let pointContainer = $('<div/>', {
                id: 'point-' + i,
                class: 'point-container'
            });

            let imageContainer = $('<div/>', {
                class: 'point-image-container'
            });

            getLeftRight(imageContainer, trip.videoLNames[i], trip.videoRNames[i], trip.videoLTimes[i], trip.videoRTimes[i], trip.path[i], trip.path[i + 1]);
            
            let textContainer = $('<div/>', {
                class: 'point-narrative'
            }).html('<font color="#ef6548">Date: ' + trip.date + ' at ' + trip.times[i] + '</font><br><font color="#253494"><strong>Street: ' + getStreetname(trip.roadids[i], streets) + '</strong></font><br>' + narrative);

            pointContainer.append(imageContainer);
            pointContainer.append(textContainer);

            
            // Use to open a comparison modal
            let compareButton = $('<button/>', {
                'data-toggle': "modal", 
                'data-target': "#compare-modal"
            }).css({
                'color': "#7fcdbb",
                'font-size': '14px',
                'position': 'absolute',
                'background': 'none',
                'border': 'none',
                'outline': 'none',
                'cursor': 'pointer',
                'padding': '5px',
                'bottom': '0',
                'left': '0'
            }).html('<i class="fa fa-info-circle" aria-hidden="true"></i>');
            
                        

            pointContainer.append(compareButton);
            sdpContainer.append(pointContainer);

            pointContainer.on('mouseover', function () {
                pointContainer.css({ 'border' : '2px solid red' });
                hoverSDP(geovisuals.map, trip.path[i]);
            });
            pointContainer.on('mouseout', function () {
                pointContainer.css({ 'border' : '2px solid #525252' });
                unhoverSDP();
            });

            pointContainer.on('click', function () {
                addVideo(trip, i);
            });

            compareButton.on('click', function (event) {
                event.stopPropagation();
                compareSDPs(trip, i);
            });
        }
    }
}

function getLeftRight(container, videoLName, videoRName, videoLTime, videoRTime,parent, child) {
    let leftrightContainer = $('<div/>').css({
        width: '100%',
        height: '20px',
    });

    let imgContainer = $('<div/>').css({
        width: '100%',
        height: 'calc(100% - 20px)',
    });

    let imageLeftContainer = $('<div/>').css({
        'width': '100%',
        'height': '100%',
        'display': 'block',
        'border-right': '1px solid #e0e0e0',
        'position': 'relative'
    });

    let imageRightContainer = $('<div/>').css({
        'width': '100%',
        'height': '100%',
        'display': 'none',
        'border-right': '1px solid #e0e0e0',
        'position': 'relative'
    });


    // Here
    //let bearing = calculateBearing(parent, child);
    //addCompass(imageLeftContainer, imageRightContainer, bearing);

    imageLeftContainer.append(getImageElement(getImagePath(videoLName, videoLTime), 'point-image', '',''));
    imageRightContainer.append(getImageElement(getImagePath(videoLName, videoRTime), 'point-image', '',''));

    imgContainer.append(imageLeftContainer);
    imgContainer.append(imageRightContainer);

    let leftButton = $('<button/>').css({
        'font-size': '10px',
        float: 'left',
        width: '50%',
        height: '100%',
        background: '#525252',
        color: '#fff',
        border: '1px solid #525252',
        'border-radius': '5px',
        outline: "none",
        cursor: "pointer",
        padding: "0"
    }).html("L");

    let rightButton = $('<button/>').css({
        'font-size': '10px',
        float: 'left',
        width: '50%',
        height: '100%',
        background: '#525252',
        color: '#fff',
        border: '1px solid #525252',
        'border-radius': '5px',
        outline: "none",
        cursor: "pointer",
        padding: "0"
    }).html("R");


    leftrightContainer.append(leftButton);
    leftrightContainer.append(rightButton);

    container.append(leftrightContainer);
    container.append(imgContainer);

    leftButton.on('click', function (event) {
        event.stopPropagation();
        leftButton.css({ 
            background: '#ffeda0',
            color: '#000',
            border: '1px solid #000', });
        rightButton.css({ 
            background: '#525252',
            color: '#fff',
            border: '1px solid #525252' });
        imageLeftContainer.css({ 'display' : 'block' });
        imageRightContainer.css({ 'display' : 'none' });
    });

    rightButton.on('click', function (event) {
        event.stopPropagation();
        leftButton.css({ background: '#525252',
        color: '#fff',
        border: '1px solid #525252' });
        rightButton.css({ background: '#ffeda0',
        color: '#000',
        border: '1px solid #000' });
        imageLeftContainer.css({ 'display' : 'none' });
        imageRightContainer.css({ 'display' : 'block' });
    });

    return leftrightContainer;
}

export function listKeywordPoints(items, keywords) {
    sdpContainer.empty();
    for (let i = 0; i < items.length; ++i) {
        //console.log(items[i]);
        let pointContainer = $('<div/>', {
            id: 'point-' + i,
            class: 'point-container'
        });

        let imageContainer = $('<div/>', {
            class: 'point-image-container'
        });

        getLeftRight(imageContainer, items[i].videoLNames, items[i].videoRNames, items[i].videoLTimes, items[i].videoRTimes, items[i].path, items[i].nextPath);

        let textContainer = $('<div/>', {
            class: 'point-narrative'
        }).html('<font color="#ef6548">Date: ' + items[i].date + ' at ' + items[i].time + '</font><br><font color="#4eb3d3">Street: ' + getStreetname(items[i].roadid) + '</font><br>' + items[i].narrative);

        textContainer.unmark();

        for (let j = 0; j < keywords.length; ++j) {
            let classname = 'selectkeyword-' + j;
            textContainer.mark(keywords[j], {className: classname});
        }



        pointContainer.append(imageContainer);
        pointContainer.append(textContainer);

        let compareButton = $('<button/>', {
            'data-toggle': "modal", 
            'data-target': "#compare-modal"
        }).css({
            'color': "#7fcdbb",
            'font-size': '14px',
            'position': 'absolute',
            'background': 'none',
            'border': 'none',
            'outline': 'none',
            'cursor': 'pointer',
            'padding': '5px',
            'bottom': '0',
            'left': '0'
        }).html('<i class="fa fa-info-circle" aria-hidden="true"></i>');

        

        pointContainer.append(compareButton);
        sdpContainer.append(pointContainer);

        pointContainer.on('mouseover', function () {
            pointContainer.css({ 'border' : '2px solid red' });
            hoverSDP(geovisuals.map, items[i].path);
        });
        pointContainer.on('mouseout', function () {
            pointContainer.css({ 'border' : 'none' });
            pointContainer.css({ 'border-bottom' : '1px solid #e0e0e0' });
            unhoverSDP();
        });

        
        pointContainer.on('click', function () {
            addVideo(items[i].trip, items[i].pointIndex);
        });

        compareButton.on('click', function (event) {
            event.stopPropagation();
            compareSDPs(items[i].trip, items[i].pointIndex);
        });
    }
}