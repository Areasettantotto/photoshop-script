/**
 * Script: prepare-typography-package.jsx
 * Target: Photoshop
 * Author: Marco Busato
 * Description:
 *   Automates the preparation of typography packages:
 *     - Merges all layers into one
 *     - Sets resolution to 300 dpi
 *     - Converts to CMYK
 *     - Saves as TIFF without overwriting originals
 *
 * Supported input formats: JPG, PNG, TIFF, BMP
 * Output: TIFF at 300 dpi, CMYK
 */

// #target photoshop

// Folder selection
var inputFolder = Folder.selectDialog("Select the folder with the original images");
var outputFolder = Folder.selectDialog("Select the destination folder");

if (!(inputFolder && outputFolder)) {
    alert("Folders not selected. Script interrupted.");
    exit();
}

var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff|bmp)$/i);
var counter = 1;

for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (!(file instanceof File)) continue;

    open(file);
    var doc = app.activeDocument;

    // Merge layers if more than one
    if (doc.layers.length > 1) {
        doc.flatten();
    }

    // Set resolution to 300 dpi without changing dimensions
    doc.resizeImage(undefined, undefined, 300, ResampleMethod.NONE);

    // Convert to CMYK
    if (doc.mode != DocumentMode.CMYK) {
        doc.changeMode(ChangeMode.CMYK);
    }

    // Save as TIFF
    var saveFile = new File(outputFolder + "/" + file.name.replace(/\.[^\.]+$/, "") + ".tif");
    var tiffOptions = new TiffSaveOptions();
    tiffOptions.imageCompression = TIFFEncoding.NONE;
    tiffOptions.layers = false; // already flattened
    tiffOptions.embedColorProfile = true;

    doc.saveAs(saveFile, tiffOptions, true, Extension.LOWERCASE);

    doc.close(SaveOptions.DONOTSAVECHANGES);
    counter++;
}

alert("Done! " + (counter - 1) + " images processed and saved as TIFF at 300 dpi CMYK.");
