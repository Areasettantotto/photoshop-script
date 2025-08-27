/**
 * Script: rename-webp.jsx
 * Target: Photoshop
 * Author: Marco Busato
 * Description:
 *   Renames and copies `.webp` files from a folder,
 *   applying a base name + incremental number.
 *   Saves the renamed files in a destination folder.
 *
 * Usage:
 *   - Run the script from Photoshop (File > Scripts > Browse...)
 *   - Select input folder (with .webp files)
 *   - Select output folder
 */

//#target photoshop

var inputFolder = Folder.selectDialog("Select the folder with the .webp files to rename");
var outputFolder = Folder.selectDialog("Select the destination folder for the renamed files");

if (inputFolder && outputFolder) {
    var files = inputFolder.getFiles(/\.(webp)$/i);
    var baseName = "base-file-name"; // Change this base name as you prefer
    var counter = 1;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!(file instanceof File)) continue;

        var newFileName = baseName + "-" + counter + ".webp";
        var newFile = new File(outputFolder + "/" + newFileName);

        // Copy the file (or use file.rename() if you want to move/rename in place)
        file.copy(newFile);

        counter++;
    }

    alert("Rinominati " + (counter - 1) + " file.");
} else {
    alert("Cartelle non selezionate.");
}
