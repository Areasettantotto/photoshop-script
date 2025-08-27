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

//#target photoshop

// Folder selection
var inputFolder = Folder.selectDialog("Select the folder with the original images");
var outputFolder = Folder.selectDialog("Select the destination folder");

if (!(inputFolder && outputFolder)) {
    alert("Folders not selected. Script interrupted.");
    throw "Folders not selected. Script interrupted.";
}

var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff|bmp|psd)$/i);
var counter = 1;
var errors = [];

// Ensure output folder exists
if (!outputFolder.exists) {
    try { outputFolder.create(); } catch (e) { /* ignore */ }
}

// Temporarily disable dialogs to avoid interruptions
var _prevDialogs = app.displayDialogs;
app.displayDialogs = DialogModes.NO;

for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (!(file instanceof File)) continue;

    var doc = null;
    try {
        open(file);
        doc = app.activeDocument;

        // Merge layers if more than one
        if (doc.layers && doc.layers.length > 1) {
            doc.flatten();
        }

        // Set resolution to 300 dpi without changing dimensions
        // use null for width/height so only resolution is changed (no resampling)
        doc.resizeImage(null, null, 300, ResampleMethod.NONE);

        // Convert to CMYK
        if (doc.mode != DocumentMode.CMYK) {
            doc.changeMode(ChangeMode.CMYK);
        }

        // Prepare unique save filename to avoid overwriting
        var baseName = file.name.replace(/\.[^\.]+$/, "");
        var saveFile = new File(outputFolder + "/" + baseName + ".tif");
        var suffix = 1;
        while (saveFile.exists) {
            saveFile = new File(outputFolder + "/" + baseName + "_" + suffix + ".tif");
            suffix++;
        }

        var tiffOptions = new TiffSaveOptions();
        tiffOptions.imageCompression = TIFFEncoding.NONE;
        tiffOptions.layers = false; // already flattened
        tiffOptions.embedColorProfile = true;

        doc.saveAs(saveFile, tiffOptions, true, Extension.LOWERCASE);

        counter++;
    } catch (e) {
        // collect error and continue
        errors.push({file: file.name, message: e.toString()});
    } finally {
        // Close document if it's still open
        try {
            if (doc && !doc.saved) {
                doc.close(SaveOptions.DONOTSAVECHANGES);
            }
        } catch (e) {
            // ignore close errors
        }
    }
}

// Restore dialogs
app.displayDialogs = _prevDialogs;

var msg = "Done! " + (counter - 1) + " images processed and saved as TIFF at 300 dpi CMYK.";
if (errors.length) {
    msg += "\n\nHowever, " + errors.length + " files failed to process:\n";
    for (var e = 0; e < errors.length; e++) {
        msg += " - " + errors[e].file + ": " + errors[e].message + "\n";
    }
}

alert(msg);
