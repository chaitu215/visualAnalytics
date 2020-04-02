import {getCollections, getTrips, getStreets} from '../query';

/**
 * load all datasets from mongodb
 * @param {*} dbname 
 */
export default function (dbname) {

    
    let index = 0, data = [];
    // Get all collections by database name
    let collections = getCollections(dbname);

    collections.forEach( function (collectionName) {

        // Split name and types
        let name = collectionName.split('-')[0],
            type = collectionName.split('-')[1];

        if (isCollectionExist(data, name)) {
            addToCollection(data, name, type, dbname);
        } else {
            // Create collection object
            let collection = {
                index: ++index,
                name: name,
                trips: [],
                streets: [],
                segnets: [],
            }
            data.push(collection);
            addToCollection(data, name, type, dbname);
        }
    });

    return data;
}

/**
 * Check if collection is already exist
 * @param {*} data 
 * @param {*} name 
 */
function isCollectionExist (data, name) {
    for (var i = 0, len = data.length; i < len; i++) {
        if (name == data[i].name) { return true; }
    }
    return false;
}

/**
 * Add to current collection
 * @param {*} data 
 * @param {*} name 
 * @param {*} type 
 * @param {*} dbname 
 */
function addToCollection (data, name, type, dbname) {

    data.forEach(function (collection) {
        if (collection.name == name) {
            let collectionName = name + "-" + type;
            switch (type) {
                case "points":
                    collection.trips = getTrips(dbname, collectionName);
                    break;
                case "streets":
                    collection.streets = getStreets(dbname, collectionName);
                    break;
                case "segnets":
                    break;
            }
            return;
        }
    });
}