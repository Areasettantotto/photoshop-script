//#target photoshop

var inputFolder = Folder.selectDialog("Scegli la cartella con le immagini originali");
var outputFolder = Folder.selectDialog("Scegli la cartella di destinazione");

if (inputFolder && outputFolder) {
    var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff|bmp)$/i);
    var baseName = "nome-file-sequenziale"; // Modifica questo nome base come preferisci
    var counter = 1;
    var savedCount = 0;

    // Dimensioni da generare, partendo da 1000 e decrescendo
    var sizes = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!(file instanceof File)) continue;

        open(file);

        var origDoc = app.activeDocument;
        var origWidth = origDoc.width.as('px');

        // Per ogni dimensione, duplichiamo il documento, ridimensioniamo (solo se non si fa upscaling)
        for (var s = 0; s < sizes.length; s++) {
            var targetWidth = sizes[s];

            // Evitiamo l'upscaling: saltiamo la dimensione se l'immagine originale è più piccola
            if (origWidth < targetWidth) {
                // skip this size
                continue;
            }

            var dup = origDoc.duplicate();

            // Ridimensiona larghezza a targetWidth mantenendo proporzioni
            dup.resizeImage(UnitValue(targetWidth, "px"), null, null, ResampleMethod.BICUBIC);

            // ----------- SALVA IN JPG ------------
            var fileNameJPG = baseName + "-" + counter + "-" + targetWidth + ".jpg";
            var saveFileJPG = new File(outputFolder + "/" + fileNameJPG);

            var jpgOptions = new ExportOptionsSaveForWeb();
            jpgOptions.format = SaveDocumentType.JPEG;
            jpgOptions.includeProfile = false;
            jpgOptions.interlaced = false;
            jpgOptions.optimized = true;
            jpgOptions.quality = 80;

            dup.exportDocument(saveFileJPG, ExportType.SAVEFORWEB, jpgOptions);

            // ----------- SALVA IN PNG ------------
            var fileNamePNG = baseName + "-" + counter + "-" + targetWidth + ".png";
            var saveFilePNG = new File(outputFolder + "/" + fileNamePNG);

            var pngOptions = new ExportOptionsSaveForWeb();
            pngOptions.format = SaveDocumentType.PNG;
            pngOptions.PNG8 = false; // PNG-24 (più qualità)

            dup.exportDocument(saveFilePNG, ExportType.SAVEFORWEB, pngOptions);

            // Chiude la copia senza salvare modifiche
            dup.close(SaveOptions.DONOTSAVECHANGES);

            savedCount += 2; // JPG + PNG
        }

        // Chiude il documento originale senza salvare modifiche
        origDoc.close(SaveOptions.DONOTSAVECHANGES);

        counter++;
    }

    alert("Fatto! " + (counter - 1) + " immagini elaborate. Versioni salvate: " + savedCount + " (JPG+PNG counted separately).");
} else {
    alert("Cartelle non selezionate.");
}
