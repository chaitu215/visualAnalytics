import * as component from '../components/component';
import { enableTripMenu } from '../components/ui/events/modeInput';
import { default as writeSentimentFile } from '../components/writeSentiment';

// Modes attributes
export let modes = {
    analysis: 'trip', // Trip and Spatial analysis
    spatialUnit: 'street', // Street and Grid spatial selection
    roiSelection: false,
    showSDPs: false
}

export let videoFlyingText = false;

// Visualization menus
export let menus = {
    videoPlayer: true,
    segnetPlayer: false,
    semanticBubble: false,
    sentimentChart: false,
    keywordTree: false,
}

// Data attributes
export let datasets = {
    dbname: 'geovisuals',
    default: [],
    regions: []
}

// Map attributes
export let map = {
    leaflet: undefined,
    mapbox: undefined,
    container: 'map'
}

// Indexing attributes
export let indexes = {
    data: 1,
    roi: 1,
    list: 1,
    lists: [1],
    currentPointIndex: 0 // For change location dynamically videoPlayer
}

// Start geovisuals system
export function start () {
    // Initialize ui events
    component.initializeUI();
    // Show loading animation and load all datasets
    component.showLoading();
    
    //datasets.default = component.loadData(datasets.dbname);
    //console.log(datasets.default);
    
    component.loadNewDatasets().then(function(result) {
        component.loadNewStreets().then(function(streets) {
            var newData = component.processNewDatasets(result, streets);
            datasets.default.push(newData);
            console.log(datasets.default);
            // Hide loading animation
            component.hideLoading();



            //creates the add point block in page and manages the functionality for adding new point
            $('#addpoint-btn').on('click', () => {

                $('#addpoint-btn').toggleClass('active');
                if ($('#addpoint-btn').hasClass('active')) {
                    let div = $('<div/>', { id: 'addpoint-container' }).css({
                        'font-size': '12px',
                        'position': 'absolute',
                        'width': '150px',
                        'height': 'auto',
                        'z-index': '1000',
                        'top': '75px',
                        'right': '5px',
                        'border': '1px solid #525252',
                        'border-radius': '5px',
                        'text-align': 'center',
                        background: '#525252'
                    });
                    let text_area = $('<textarea/>', { rows: '4' }).css({
                        width: '100%',
                        height: '100px'
                    }).html('Add narratives here...');
                    let button = $('<button/>', { id: 'update-point-btn' }).html('update');
                    
                    div.append(text_area).append(button);
                    $('.vis').append(div);

                    button.on('click', () => { update(); });

                } else {
                    $('#addpoint-container').remove();
                }
            });

            /*
            if (map.mapbox) {
                map.mapbox = component.createMapbox('mapbox');
            } else {
                map.mapbox = component.createMapbox('mapbox');
                map.mapbox.resize();
            }*/

            // Initialize map
            
            if (map.leaflet) {
                component.resetMap(map.leaflet);
                map.leaflet = component.createMap(map.container);
                component.resizeMap(map.leaflet);
            } else {
                map.leaflet = component.createMap(map.container);
                component.resizeMap(map.leaflet);
            }
            enableTripMenu();
            // Update geovisuals system
            update();
            /*
            map.mapbox.on('load', () => {
                update();
            });*/
        });
    });
}

// Update geovisuals system
export function update () {

    $('#addpoint-container').remove();

    // Write sentiment to check
    /*writeSentimentFile(datasets.default[indexes.data - 1].trips);*/
    

    // List all data collections
    component.listCollections(indexes.data, datasets.default);
    component.resizeMap(map.leaflet);
    component.enableVideo();
    // Clear video for memory cost (additional)
    component.clearVideo();

    //reset_detail_view();
    $("#sdp").nextAll().remove();

    // Clone current datasets
    let cloneData = _.cloneDeep(datasets.default[indexes.data - 1]);
    let cloneDataRegions = _.cloneDeep(datasets.regions);

    // Get current selected region of interest
    let roi = getSelectedRoi(cloneData, cloneDataRegions);

    // Filter keywords
    roi.trips = component.filterByKeywords(roi.trips); // need to set this

    // Trip analysis mode
    if (modes.analysis == 'trip') {

        // Change header
        $('#roi-header').html('Trips List');
        $('#addpoint-btn').show();
        $('#equalizer-btn').show();
        $('#trip-detail-btn').show();
        $('#compare-btn').show();
        $('#sdp-toggle').show();
        $('#trip-detail-container').show();

        enableTripDetailOnMap();

        let trips = (modes.roiSelection) ? roi.trips : [roi.trips[indexes.list - 1]];

        component.initializeKeywords(trips);
        
        // All trips inside that region
        let roiTrips = roi.trips;

        console.log(roiTrips);
        console.log(trips);

        // List all trips
        component.listTrips(cloneData, cloneDataRegions, roiTrips);
        // Highlight selection roi
        (modes.roiSelection) ?   component.selectRoi(indexes.roi) : 
                        component.selectList(indexes.roi, indexes.list);

        // Create visualization
        showTrips(roiTrips, trips);
        return;
    }

    // Spatial analysis mode
    if (modes.analysis == 'spatial') {

        // Change header
        $('#roi-header').html('Geo-object List');
        
        // Initialize new keywords
        let trips = (modes.roiSelection) ? roi.trips : [roi.trips[indexes.list - 1]];
        component.initializeKeywords(trips);

        // Change map and showcase
        $('#map').css({ 'height': '61%' });
        $('#showcase').css({ 'height': '38%', 'margin-top': '0.36%' });
        $('#addpoint-btn').hide();
        $('#menus').show();
        $('#equalizer-btn').hide();
        $('#trip-detail-btn').hide();
        $('#compare-btn').hide();
        $('#sdp-toggle').hide();

        disableTripDetailOnMap();
        // Disable video player menu
        component.disableVideo();
        
        if (modes.spatialUnit == 'street') {

            $('#region-options-container').hide();

            // All streets data
            let allStreets = datasets.default[indexes.data - 1].streets;
            // Prepare street data
            let roiStreets = component.prepareStreets(roi.trips, allStreets);
            
            // Sort streets
            roiStreets.sort( function (a, b) {
                return b.narratives.length - a.narratives.length;
            });

            let streets = [];
            // Get all streets inside that region
            if (modes.roiSelection) {
                streets = roiStreets;     
            } else {
                indexes.lists.forEach( i => {
                    streets.push(roiStreets[i - 1]);
                });
            }

            //indexes.lists = [];

            // List all selected streets
            component.listStreets(roiStreets, indexes.lists);
            showStreets(roiStreets, streets);
            return;
        }

        // Need to fix this
        if (modes.spatialUnit == 'region') {

            // Change roi header
            $('#roi-header').html('Geo-object List');

            console.log('start region units');
            $('#region-options-container').show();
            // clear all map layers
            component.removeAllLayer(map.leaflet);
            // initialize region mode
            component.initializeRegion(roi.trips, indexes.lists);

            return;
        }
    }
}

// Show visualization
export function showTrips (roiTrips, trips) {

    // Fix dynamic height
    (indexes.data == 1) ? $('#filters').css({
        'max-height' : '45%'
    }) : $('#filters').css({
        'max-height' : '70.8%'
    });

    // Hide region options
    $('#region-options-container').hide();
    $('#menus').hide();
    $('.detail-view').show();
    $("#sdp").show();


    // Need to clear map here
    component.removeAllLayer(map.leaflet);

    // Video players (only work on trips)
    if (menus.videoPlayer) {
        // Display all default trips
        component.displayAllTrips(map.leaflet, roiTrips);
        component.displaySelectTrip(map.leaflet, trips);
        component.displayTripPoints(map.leaflet, trips);
        // Show minimap and initialize minimap components
        // component.showMinimap(map.leaflet);
        component.initMinimap(roiTrips, trips);
        component.createTripSDPs(trips[0]);
        // Mapbox testing
        /*
        component.resetMapbox(map.mapbox);
        component.showMapboxAllTrips(roiTrips, map.mapbox);*/

        /*map.mapbox.on('load', () => {
            component.showMapboxAllTrips(roiTrips, map.mapbox);
        });*/

        // Show current keyword wordloud of first trips
        // component.showCurrentWordCloud(trips[0].keywords);
        // Create detail view if enabled
        
        /*
        if (modes.showSDPs) {
            // Add sdps
            component.createTripSDPs(trips[0]);
        }*/

        // All togglable layers
        //component.addLayerControls(map.leaflet);
        // Add video players
        component.initializeVideo(trips);
        // Draw equalizer bar chart
        component.displayTripEqualizer(trips[0].path[0], indexes.list);
        return;
    }

    if (menus.segnetPlayer) {
        // Segnet player
        return;
    }
}

/**
 * Display all spatial street units
 * @param {*} roiStreets - all streets
 * @param {*} streets - selected streets
 */
export function showStreets (roiStreets, streets) {

    // Fix dynamic height
    $('#filters').css({ 'max-height' : '38%' });
    
    // Hide detail view
    reset_detail_view();

    // Remove all layers over map
    component.removeAllLayer(map.leaflet);
    component.resizeMap(map.leaflet);

    if (menus.semanticBubble) {

        $('#map').css({ 'height': '61%' });
        $('#showcase').css({ 'height': '38%', 'margin-top': '0.36%' });

        // Highlight selection streets
        console.log(streets);
        /*
        (modes.roiSelection) ? component.selectRoi(indexes.roi) : 
        component.selectLists(indexes.roi, indexes.lists);*/

        // Display all streets by sdps count
        //component.displayStreetBySemantic(map.leaflet, roiStreets);
        //component.displaySelectStreetBySemantic(map.leaflet, streets);
        component.displayStreetBySemantic(map.leaflet, roiStreets);
        

        // Draw bubble chart
        component.drawStreetBubble(streets);

        return;


        //component.displayStreetBySemantic(map.leaflet, roiStreets);
        //component.displaySelectStreetBySemantic(map.leaflet, streets);
        

    } else if (menus.sentimentChart) {

        console.log(indexes.lists);
        if (indexes.lists.length > 0) {
            $('#map').css({ 'height': '61%' });
            $('#showcase').css({ 'height': '38%', 'margin-top': '0.36%' });
        } else {
            $('#map').css({ height: '100%' });
            $('#showcase').css({ height: '0%' });
        }


        // List all selected streets
        (modes.roiSelection) ? component.selectRoi(indexes.roi) : component.selectLists (indexes.roi, indexes.lists);

        // Display all streets by sentiment score
        var allStreets = component.displayStreetBySentiment(map.leaflet, roiStreets);

        // Get all streets
        let streets = [];

        // Get all streets inside that region
        if (modes.roiSelection) {
            streets = allStreets;
        } else {
            indexes.lists.forEach( i => {
                streets.push(allStreets[i - 1]);
            });
        }

        // Draw sentiment line chart with chart.js
        let streetsSentiment = component.drawSentimentLine(streets);
        component.displaySelectStreetBySentiment(map.leaflet, streets, streetsSentiment);

        if (modes.showSDPs) {
            component.showStreetSDPs(streets);
        }

        return;

    } else if (menus.keywordTree) {

        // Fix map height
        $('#map').css({ 'height' : '49.5%' });
        $('#showcase').css({ 'height' : '49.3%' });

        // Resize map
        component.resizeMap(map.leaflet);

        component.selectRoi(indexes.roi);
        // Highlight selection streets
        //(modes.roiSelection) ? component.selectRoi(indexes.roi) : 
        //component.selectLists(indexes.roi, indexes.lists);

        // Display all streets by sdps count
        component.displayStreetBySemantic(map.leaflet, roiStreets);
        component.displaySelectStreetBySemantic(map.leaflet, streets);

        //console.log();

        // Display streets
        
        // Fix keyword tree selection
        component.keywordTree(streets);
        
        return;
    }
}

export function showRegions (trips, distance) {
    
    // Fix dynamic height
    $('#filters').css({ 'max-height' : '38%' });
    
    reset_detail_view();


    // initialize region
    component.initializeRegion(trips);
    /*
    if (menus.semanticBubble) {
        let cells = component.squareGridPoints(trips, distance, {units: 'miles'});
        component.listSemanticRegion(cells, indexes.lists);
        (modes.roiSelection) ? component.selectRoi(indexes.roi) : 
        component.selectLists(indexes.roi, indexes.lists);
        // Hide minimap
        component.hideMinimap(map.leaflet);
        component.displaySemanticHeatmap(cells, map.leaflet);
        //indexes.lists
        // All togglable layers
        //component.addLayerControls(map.leaflet);
        return;
    } else if (menus.sentimentChart) {
        let cells = component.squareGridSentiment(trips, distance, {units: 'miles'});
        component.listSemanticRegion(cells, indexes.lists);
        // Hide minimap
        component.hideMinimap(map.leaflet);
        component.displaySentimentHeatmap(cells, map.leaflet);
        // All togglable layers
        //component.addLayerControls(map.leaflet);
        return;
    } else if (menus.keywordTree) {
        return;
    }*/
    return;
} 

function setSliderEvents (trips) {
    // Region slider
    let distanceSlider = $('#grid-distance');
    let distanceValue = $('#units-controller-value');

    distanceSlider.attr('min', 0.05);
    distanceSlider.attr('max', 0.5);
    distanceSlider.attr('step', 0.05);
    distanceSlider.attr('value', 0.05);
    distanceSlider.val(0.05);
    distanceValue.html('&nbsp;' + distanceSlider.val() + ' miles');
    showRegions(trips, 0.1);
    distanceSlider.on('input', function () {
        let gridDistance = distanceSlider.val();
        distanceValue.html('&nbsp;' + distanceSlider.val() + ' miles');
        showRegions(trips, gridDistance);
    });
    return;
}

// Reset whole geovisuals system
export function reset () {
    // Reset input filter keywords
    component.resetKeywordInput();
    // Set start roi index
    setRoiIndex(1);
    // Set roi selection to false
    setSelectOnRoi(false);
    return;
}

/**
 * Reset all menu to false
 */
export function resetMenu () {
    menus = _.mapValues(menus, () => false);
    return;
}
/**
 * Set current menu by object key
 * @param {*} key 
 */
export function enableMenu(key) {
    menus[key] = true;
    return;
}

/**
 * Set analysis mode
 * @param {*} value 
 */
export function setAnalysisMode (value) {
    // Reset keyword filter
    
    // Set default units
    modes.spatialUnit = 'street';
    // Set current analysis mode
    modes.analysis = value;
    return;
}

export function setSpatialUnit (value) {
    // Reset all street selection
    resetSelection();
    // Set spatial units
    modes.spatialUnit = value;
    return;
}

/**
 * Set current data index
 * @param {*} index 
 */
export function setDataIndex (index) {
    // Need to reset every thing here!
    setRoiIndex(1);
    setSelectOnRoi(false);
    // Reset selection index
    resetSelection();
    component.resetKeywordInput();
    return indexes.data = index;
}
export function setRoiIndex (index) {
    // Reset list index
    setListIndex(1);
    return indexes.roi = index;
}
export function setListIndex (index) {
    return indexes.list = index;
}

/**
 * Multiple list indexes item
 */
export function resetSelection () {
    return indexes.lists = [];//[1];
}

export function addSelection (index) {
    return indexes.lists.push(index);
}

export function removeSelection (index) {
    // Find index of the removing item
    var removeIndex = indexes.lists.indexOf(index);
    //console.log(removeIndex);
    if (removeIndex !== -1) {
        // Remove item from particular removing index
        indexes.lists.splice(removeIndex, 1);
        return;
    }
    return;
}

/**
 * Get selected roi
 * @param {*} data 
 * @param {*} dataRegion 
 */
export function getSelectedRoi (data, dataRegion) {
    // Get selected region by index
    if (indexes.roi == 1) {
        return data;
    } else {
        // Get region by id
        let pos = dataRegion.map(function (x) {
            return x.id;
        }).indexOf(indexes.roi);
        return dataRegion[pos];
    }
}

/**
 * add roi
 * @param {*} trips 
 * @param {*} layer 
 */
export function addRoi (trips, layer) {
    if (trips.length > 0) {

        let id = indexes.roi + 1; // increment roi index
        let streets = datasets.default[indexes.data - 1].streets;

        let region = {
            id: id,
            trips: trips,
            streets: streets,
            layer: layer
        }
        datasets.regions.push(region);
        return;
    } else {
        alert("We cannot found any trips passing this area.");
        return;
    }
}

export function setSelectOnRoi (bool) {
    modes.roiSelection = bool;
    return;
}

/**
 * Location name e.g., joplin, akron
 */
export function getCurrentLocationName () {
    return datasets.default[indexes.data - 1].name;
}

/**
 * Use to pass map across the environments
 */
export function getCurrentMap () {
    return map.leaflet;
}
/**
 * Use to get current streets
 */
export function getCurrentStreets () {
    return datasets.default[indexes.data - 1].streets;
}

export function getCurrentTrip () {
    return datasets.default[indexes.data - 1].trips[indexes.list - 1];
}

export function getAllTrips () {
    return datasets.default[indexes.data - 1].trips;
}

export function disableTripDetailOnMap () {
    $('#equalizer').hide();
    $('#trip-detail-container').hide();
    $('#trip-wordcloud').hide();
    $("trip-detail-btn").hide();
    return;
}

export function enableTripDetailOnMap() {
    //$('#equalizer').show();
    //$('#trip-detail-container').show();
    //$('#trip-wordcloud').show();
    $("trip-detail-btn").show();
    component.addTripDetailEvents();
    return;
}

export function reset_detail_view()
{
    component.dom.visContainer.css({ width: 'calc(100% - 15%)' });
    component.dom.sdpContainer.css({ width: '0%;' });
    component.dom.sdpToggleBtn.removeClass('active');
    modes.showSDPs = false;

    return;
}

export function set_video_flying_text(bool)
{
    return videoFlyingText = bool;
}