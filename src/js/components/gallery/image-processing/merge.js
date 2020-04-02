import Jimp from 'jimp/es';
import { default as dom } from '../ui-element';
/**
 * Merge image together with masks
 * @param {*} image 
 * @param {*} mask 
 */

export default function (imagePath, maskPath) 
{
    dom.imageContainer.empty();

    //const mat = cv.imread('./path/img.jpg');
    cv.readImage(imagePath, function (err, img) {
        if (err) {
          throw err;
        }
      
        const width = im.width();
        const height = im.height();
      
        console.log(width + ' ' + height);
      });
    
    /*
    var p1 = Jimp.read(imagePath);
    var p2 = Jimp.read(maskPath);
    Promise.all([ p1, p2]).then( function (images) {
        var original = images[0];
        var mask = images[1];

        original.mask(mask, 0, 0).getBase64(Jimp.AUTO, (err, res) => {

            
            //Jimp.read(Buffer.from(res.replace(/^data:image\/png;base64,/, ""), 'base64')).then( img => {
            //   console.log(img);
            //}).catch(err => {
            //    console.log(err);
            //});

            //var buffer = res;
            var imgElement = document.createElement('img');
                imgElement.className = 'gallery-img';
                //imgElement.src = 'data:image/png;base64,' + res;
                imgElement.src = res;
                if ('' != null) imgElement.alt = '';
                if ('' != null) imgElement.title = '';

            dom.imageContainer.append(imgElement);
        });

    }).catch( err => {
        //console.log(err);
    });*/

    return;
}