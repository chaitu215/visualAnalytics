export default function (name, streets) {
    let path = [];
    streets.forEach( street => {
        if (street.name == name) {
            street.segments.forEach( segment => {
                let s = [];
                segment.forEach(point => {
                    s.push([point[1], point[0]]);
                });
                path.push(s);
            });
        }
    });
    return path;
}