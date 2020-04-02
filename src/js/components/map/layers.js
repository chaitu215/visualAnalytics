/**
 * map layers
 */
export default {
    // All trips layer
    allTrips: new L.FeatureGroup(),
    // Current trip layer
    currentTrip: new L.FeatureGroup(),
    hoverCurrentTrip: new L.FeatureGroup(),
    pointTrip: new L.FeatureGroup(),

    //Marker cluster group (still fix)
    narrativeMarkers: L.markerClusterGroup({
        showCoverageOnHover: true,
        iconCreateFunction: function (cluster) {
            var markers = cluster.getAllChildMarkers();
            //console.log(markers);
            return L.divIcon({
                iconSize: L.point(40,40),
                html: markers.length, 
                className: 'narrative-cluster'
            });
        },
        removeOutsideVisibleBounds: true
    }),
    convexHull: new L.FeatureGroup(),

    // Video marker
    videoMarker: new L.FeatureGroup(),
    videoMinimap: new L.FeatureGroup(),
    currentMinimapMarker: new L.FeatureGroup(),

    // All streets layer
    allStreets: new L.FeatureGroup(),
    selectStreets: new L.FeatureGroup(),
    streetSemanticPoint: new L.FeatureGroup(),
    streetSemanticHover: new L.FeatureGroup(),
    streetSematicLegend: L.control({ position: 'bottomright' }),
    semanticStreets: L.control({ position: 'topright' }),

    // All regions layer
    regionSemanticHeatmap: new L.FeatureGroup(),
    regionSentimentHeatmap: new L.FeatureGroup(),
    regionCellNumber: new L.FeatureGroup(),

    sentimentImage: new L.featureGroup(),

    // Gallery with keyword selection
    currentKeywords: L.control({
        position: 'topleft'
    }),

    // video player map layers
    videoPlayer: {
        sliderMarker: new L.featureGroup()
    },

    // Keyword tree layer
    keywordTreePoints: new L.FeatureGroup()
}