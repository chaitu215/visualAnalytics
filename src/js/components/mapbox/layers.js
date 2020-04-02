export default {

    // all trips
    // alltrip

    // All trips layer
    allTrips: {
        'id': 'route',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features':[]
            }
        },
        'paint': {
            'line-color': '#000',
            'line-opacity': 0.2,
            'line-width': 3
        }
    }

}