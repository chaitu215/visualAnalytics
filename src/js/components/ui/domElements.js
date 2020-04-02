/**
 * List of all dom elements
 */
export default {
    
    modeInput: $("input[name='mode']"),
    tripMode: $("input[name='mode'][value='trip']"),
    spatialMode: $("input[name='mode'][value='spatial']"),
    // Loader
    loader: $('.loader-container'),

    // Dataset
    dataContent: $('#dataset-content'),
    // units
    unitsContainer: $('#units'),
    // Unit mode street or region
    unitInput: $("input[name='units']"),
    streetUnit: $("input[name='units'][value='street']"),
    regionUnit: $("input[name='units'][value='region']"),
    
    // roi
    roiContainer: $('#rois'),
    roiContent: $('#rois-content'),

    // Filter
    // Keyword inputs
    keywordInput: $('#filter-keyword-input'),

    // Menus
    // videoMenu: $('#video-menu'),
    // segnetMenu: $('#segnet-menu'),
    // semanticMenu: $('#semantic-menu'),
    // sentimentMenu: $('#sentiment-menu'),
    // keywordTreeMenu: $('#keywordtree-menu'),

    // Menu of radio inputs
    tripMenus: $('#trip-menus'),
    tripOptionInput: $("input[name='trip-options']"),
    tripVideoOption: $("input[name='trip-options'][value='video']"),
    tripSegnetOption: $("input[name='trip-options'][value='segnet']"),

    spatialMenus: $('#spatial-menus'),
    spatialOptionInput: $("input[name='spatial-options']"),
    bubbleOption: $("input[name='spatial-options'][value='bubble']"),
    sentimentOption: $("input[name='spatial-options'][value='sentiment']"),
    treeOption: $("input[name='spatial-options'][value='tree']"),

    // Map container
    mapContainer: $('#map'),
    // Layer button
    layerButton: $('#layer-btn'),
    layerContainer: $('#layer-container'),
    switchmapButton: $('#trip-detail-map'),
    // Vis container
    videoPlayer: $('#video-player'),
    segnetPlayer: $('#segnet-player'),
    semanticBubble: $('#semantic-bubble'),
    sentimentChart: $('#sentiment-chart'),
    keywordTree: $('#keyword-tree'),

    visContainer: $('.vis'),
    // SDPs
    sdpContainer: $('.detail-view'),
    sdpToggleBtn: $('#sdp-toggle'),
    sdpWrapper: $('#sdp'),
    equalizer: $('#equalizer'),

    // video controls
    playButton: $('#video-playButton'),
    videoLeft: $('#video-player-left'),
    videoMiddle: $('#video-player-middle'),
    videoRight: $('#video-player-right'),
    leftVideoButton: $('#video-leftBtn'),
    rightVideoButton: $('#video-rightBtn'),
    leftrightVideoButton: $('#video-leftrightBtn'),
    videoSlider: $('#video-slider'),
    timeHandle: $('#time-handle'),

    minimapContainer: $('#minimap'),
    videoPlayerMinimap: $('#trip-detail-map'),
    videoKeywords: $('#trip-wordcloud'),

    currentTripDate: $('#trip-detail-date'),
    currentTripTime: $('#trip-detail-time'),
    currentTripStreet: $('#trip-detail-street'),
    currentTripNarrative: $('#trip-detail-narrative'),

    imageLeft: $('#image-player-left'),
    imageRight: $('#image-player-right'),

    imageLeftData:$('#data-player-left'),
    imageRightData: $('#data-player-right'),

    chartjs : $('my_dataviz')

}