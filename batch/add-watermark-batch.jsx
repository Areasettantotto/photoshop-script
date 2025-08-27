/**
 * Script: add-watermark-batch.jsx
 * Target: Photoshop
 * Author: Marco Busato
 * Description:
 *   Adds a watermark/logo to the bottom right corner of all images
 *   in a folder and its subfolders.
 *   Maintains the folder structure in the output and allows customization of:
 *     - margin from the edge
 *     - maximum logo size
 *     - export format (PNG or JPG) and JPG quality
 */

// #target photoshop

// Select folders and file
var inputFolder = Folder.selectDialog("Select the main folder containing the images");
var outputFolder = Folder.selectDialog("Select the destination folder");
var watermarkFile = File.openDialog("Select the watermark/logo file (PNG with transparency recommended)");

if (!(inputFolder && outputFolder && watermarkFile)) {
    alert("Folders or logo not selected. Stopping the script.");
    exit();
}

// Customizable parameters
var margin = parseInt(prompt("Enter the margin from the edge in pixels:", "20"), 10);
var maxLogoPercent = parseFloat(prompt("Maximum logo size as a percentage of the image width (0-100):", "20"));
var exportFormat = prompt("Export format: 'PNG' or 'JPG':", "PNG").toUpperCase();
var jpgQuality = 80;
if (exportFormat === "JPG") {
    jpgQuality = parseInt(prompt("JPG quality (1-100):", "80"), 10);
}

// Recursive function to get all image files
function getFilesRecursively(folder) {
    var allFiles = [];
    var entries = folder.getFiles();
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (entry instanceof Folder) {
            allFiles = allFiles.concat(getFilesRecursively(entry));
        } else if (entry instanceof File && entry.name.match(/\.(jpg|jpeg|png|tif|tiff|bmp)$/i)) {
            allFiles.push(entry);
        }
    }
    return allFiles;
}

var files = getFilesRecursively(inputFolder);
var counter = 1;

for (var i = 0; i < files.length; i++) {
    var file = files[i];

    // Calculate relative path and create corresponding folder in output
    var relativePath = file.parent.fsName.replace(inputFolder.fsName, "");
    var targetFolder = new Folder(outputFolder + relativePath);
    if (!targetFolder.exists) targetFolder.create();

    open(file);
    var doc = app.activeDocument;

    // Open the logo and copy it
    var logoDoc = open(watermarkFile);
    logoDoc.selection.selectAll();
    logoDoc.selection.copy();
    logoDoc.close(SaveOptions.DONOTSAVECHANGES);

    // Paste the logo
    doc.paste();
    var logoLayer = doc.activeLayer;

    // Resize the logo if it's too large
    var maxLogoWidth = doc.width.as("px") * (maxLogoPercent / 100);
    var logoWidth = logoLayer.bounds[2].as("px") - logoLayer.bounds[0].as("px");
    if (logoWidth > maxLogoWidth) {
        var scalePercent = (maxLogoWidth / logoWidth) * 100;
        logoLayer.resize(scalePercent, scalePercent, AnchorPosition.MIDDLECENTER);
    }

    // Position at bottom right with margin
    var logoBounds = logoLayer.bounds;
    var logoWidth = logoBounds[2].as("px") - logoBounds[0].as("px");
    var logoHeight = logoBounds[3].as("px") - logoBounds[1].as("px");

    logoLayer.translate(
        doc.width.as("px") - logoBounds[2].as("px") - margin,
        doc.height.as("px") - logoBounds[3].as("px") - margin
    );

    // Save the image
    var saveFile = new File(targetFolder + "/" + file.name.replace(/\.[^\.]+$/, "") + "." + exportFormat.toLowerCase());

    if (exportFormat === "PNG") {
        var pngOptions = new ExportOptionsSaveForWeb();
        pngOptions.format = SaveDocumentType.PNG;
        pngOptions.PNG8 = false; // PNG-24
        doc.exportDocument(saveFile, ExportType.SAVEFORWEB, pngOptions);
    } else { // JPG
        var jpgOptions = new ExportOptionsSaveForWeb();
        jpgOptions.format = SaveDocumentType.JPEG;
        jpgOptions.includeProfile = false;
        jpgOptions.interlaced = false;
        jpgOptions.optimized = true;
        jpgOptions.quality = jpgQuality;
        doc.exportDocument(saveFile, ExportType.SAVEFORWEB, jpgOptions);
    }

    doc.close(SaveOptions.DONOTSAVECHANGES);
    counter++;
}

alert("Done! " + (counter - 1) + " images processed with the watermark in all folders.");
