/**
 * Create dom image element
 * @param {*} src 
 * @param {*} classname 
 * @param {*} alt 
 * @param {*} title 
 */
export default function (src, classname, alt, title)
{
    try {
        var img = document.createElement('img');
        img.className = classname;
        img.src = src;
        if (alt != null) img.alt = alt;
        if (title != null) img.title = title;
        return img;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}