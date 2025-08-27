/**
 * Script: resize-export-1000px.jsx
 * Target: Photoshop
 * Author: Marco Busato
 * Description:
 *   Resizes all input images to a maximum width of 1000px
 *   (maintains aspect ratio, no upscaling) and exports each version
 *   as JPG + PNG-24.
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

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!(file instanceof File)) continue;

        open(file);

        // Resize width to 1000px while maintaining proportions
        var doc = app.activeDocument;
        var targetWidth = 1000;
        if (doc.width > targetWidth) {
            doc.resizeImage(UnitValue(targetWidth, "px"), null, null, ResampleMethod.BICUBIC);
        }

        // ----------- SAVE AS JPG ------------
        var fileNameJPG = baseName + "-" + counter + ".jpg";
        var saveFileJPG = new File(outputFolder + "/" + fileNameJPG);

        var jpgOptions = new ExportOptionsSaveForWeb();
        jpgOptions.format = SaveDocumentType.JPEG;
        jpgOptions.includeProfile = false;
        jpgOptions.interlaced = false;
        jpgOptions.optimized = true;
        jpgOptions.quality = 80;

        doc.exportDocument(saveFileJPG, ExportType.SAVEFORWEB, jpgOptions);

        // ----------- SAVE AS PNG ------------
        var fileNamePNG = baseName + "-" + counter + ".png";
        var saveFilePNG = new File(outputFolder + "/" + fileNamePNG);

        var pngOptions = new ExportOptionsSaveForWeb();
        pngOptions.format = SaveDocumentType.PNG;
        pngOptions.PNG8 = false; // PNG-24 (più qualità)

        doc.exportDocument(saveFilePNG, ExportType.SAVEFORWEB, pngOptions);

        // Closes without saving changes
        doc.close(SaveOptions.DONOTSAVECHANGES);

        counter++;
    }

    alert("Done! " + (counter - 1) + " images processed in JPG and PNG.");
} else {
    alert("Folders not selected.");
}
