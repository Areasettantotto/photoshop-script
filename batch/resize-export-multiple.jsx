/**
 * Script: resize-export-multiple.jsx
 * Target: Photoshop
 * Author: Marco Busato
 * Description:
 *   Resizes all input images to multiple predefined widths,
 *   avoiding upscaling, and exports each version in JPG + PNG-24.
 *
 * Generated sizes: 1000 → 100 px (step of 100).
 *
 * Usage:
 *   - Run the script from Photoshop
 *   - Select the input folder with the original images
 *   - Select the destination folder
 */

//#target photoshop

var inputFolder = Folder.selectDialog("Select the folder with the original images");
var outputFolder = Folder.selectDialog("Select the destination folder");

if (inputFolder && outputFolder) {
    var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff|bmp)$/i);
    var baseName = "sequential-file-name"; // Change this base name as you prefer
    var counter = 1;
    var savedCount = 0;

    // Sizes to generate, starting from 1000 and decreasing
    var sizes = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!(file instanceof File)) continue;

        open(file);

        var origDoc = app.activeDocument;
        var origWidth = origDoc.width.as('px');

        // For each size, duplicate the document and resize (only if not upscaling)
        for (var s = 0; s < sizes.length; s++) {
            var targetWidth = sizes[s];

            // Avoid upscaling: skip this size if the original image is smaller
            if (origWidth < targetWidth) {
                // skip this size
                continue;
            }

            var dup = origDoc.duplicate();

            // Resize width to targetWidth while maintaining proportions
            dup.resizeImage(UnitValue(targetWidth, "px"), null, null, ResampleMethod.BICUBIC);

            // ----------- SAVE AS JPG ------------
            var fileNameJPG = baseName + "-" + counter + "-" + targetWidth + ".jpg";
            var saveFileJPG = new File(outputFolder + "/" + fileNameJPG);

            var jpgOptions = new ExportOptionsSaveForWeb();
            jpgOptions.format = SaveDocumentType.JPEG;
            jpgOptions.includeProfile = false;
            jpgOptions.interlaced = false;
            jpgOptions.optimized = true;
            jpgOptions.quality = 80;

            dup.exportDocument(saveFileJPG, ExportType.SAVEFORWEB, jpgOptions);

            // ----------- SAVE AS PNG ------------
            var fileNamePNG = baseName + "-" + counter + "-" + targetWidth + ".png";
            var saveFilePNG = new File(outputFolder + "/" + fileNamePNG);

            var pngOptions = new ExportOptionsSaveForWeb();
            pngOptions.format = SaveDocumentType.PNG;
            pngOptions.PNG8 = false; // PNG-24 (higher quality

            dup.exportDocument(saveFilePNG, ExportType.SAVEFORWEB, pngOptions);

            // PNG-24 is higher quality than PNG-8
            dup.close(SaveOptions.DONOTSAVECHANGES);

            savedCount += 2; // JPG + PNG
        }

        // Closes the original document without saving changes
        origDoc.close(SaveOptions.DONOTSAVECHANGES);

        counter++;
    }

    alert("Done! " + (counter - 1) + " images processed. Versions saved: " + savedCount + " (JPG+PNG counted separately).");
} else {
    alert("Folders not selected.");
}
