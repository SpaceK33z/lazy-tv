// Copied  from https://gist.github.com/DominicTobias/b1fb501349893922ec7f

function loadImage(src, callback) {
    var image = new Image();
    image.onload = function(e) {
        callback(image);
        image = null;
    };

    image.src = src;
}

function scaleSize(options) {
    var scale =
        options.scale ||
        Math.min(options.maxWidth / options.width, options.maxHeight / options.height);

    scale = Math.min(scale, options.maxScale || 1);

    return {
        scale: scale,
        width: options.width * scale,
        height: options.height * scale,
    };
}

export default function cropImage(imgSrc, crop, maxWidth, maxHeight) {
    return new Promise(resolve => {
        loadImage(imgSrc, cropAfterLoad);

        function cropAfterLoad(loadedImg) {
            var imageWidth = loadedImg.naturalWidth;
            var imageHeight = loadedImg.naturalHeight;

            var cropX = crop.x / 100 * imageWidth;
            var cropY = crop.y / 100 * imageHeight;

            var cropWidth = crop.width / 100 * imageWidth;
            var cropHeight = crop.height / 100 * imageHeight;

            var destWidth = cropWidth;
            var destHeight = cropHeight;

            if (maxWidth || maxHeight) {
                // Scale the crop.
                var scaledCrop = scaleSize({
                    width: cropWidth,
                    height: cropHeight,
                    maxWidth: maxWidth,
                    maxHeight: maxHeight,
                });

                destWidth = scaledCrop.width;
                destHeight = scaledCrop.height;
            }

            var canvas = document.createElement('canvas');
            canvas.width = destWidth;
            canvas.height = destHeight;
            var ctx = canvas.getContext('2d');

            ctx.drawImage(
                loadedImg,
                cropX,
                cropY,
                cropWidth,
                cropHeight,
                0,
                0,
                destWidth,
                destHeight
            );

            resolve(canvas.toDataURL('image/png'));
        }
    });
}
