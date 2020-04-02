import {dom} from '../../component';
// Show sdps of all selected streets
export default function (streets) {
    // Clear sdp wrappers
    var sdps = document.getElementById('sdp');
    sdps.innerHTML = "";
    //dom.sdpWrapper.empty();
    console.log(streets);

    // Iterate through all street
    streets.forEach( street => {
        let header = createHeader(street.name);
        // Add all dom elements
        //dom.sdpWrapper.appendChild(header);
        sdps.appendChild(header);
    });
}

/**
 * Create header of all sdp points by street name
 * Can show and hide current street
 * @param {*} streetname 
 */
function createHeader (streetname) {
    let container = document.createElement("div");
    container.className = 'point-header'
    container.innerHTML = streetname;

    container.onclick = function () {
        console.log("toggled");
    }
    return container;
}