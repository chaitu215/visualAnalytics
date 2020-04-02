export default {
    defaultTrip: new L.featureGroup(),
    heatmap: new L.featureGroup(),
    selectRegion: new L.featureGroup(),
    sentimentPoint: new L.featureGroup(),
    semanticRegionLegend: L.control({ position: 'topright' }),
    sentimentRegionLegend: L.control({ position: 'bottomright' })
}