//#target photoshop

var inputFolder = Folder.selectDialog("Scegli la cartella con le immagini originali");
var outputFolder = Folder.selectDialog("Scegli la cartella di destinazione");

if (inputFolder && outputFolder) {
    var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff|bmp)$/i);
    var baseName = "nome-file-sequenziale"; // Modifica questo nome base come preferisci
    var counter = 1;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!(file instanceof File)) continue;

        open(file);

        // Ridimensiona larghezza a 1000px mantenendo proporzioni
        var doc = app.activeDocument;
        var targetWidth = 1000;
        if (doc.width > targetWidth) {
            doc.resizeImage(UnitValue(targetWidth, "px"), null, null, ResampleMethod.BICUBIC);
        }

        // ----------- SALVA IN JPG ------------
        var fileNameJPG = baseName + "-" + counter + ".jpg";
        var saveFileJPG = new File(outputFolder + "/" + fileNameJPG);

        var jpgOptions = new ExportOptionsSaveForWeb();
        jpgOptions.format = SaveDocumentType.JPEG;
        jpgOptions.includeProfile = false;
        jpgOptions.interlaced = false;
        jpgOptions.optimized = true;
        jpgOptions.quality = 80;

        doc.exportDocument(saveFileJPG, ExportType.SAVEFORWEB, jpgOptions);

        // ----------- SALVA IN PNG ------------
        var fileNamePNG = baseName + "-" + counter + ".png";
        var saveFilePNG = new File(outputFolder + "/" + fileNamePNG);

        var pngOptions = new ExportOptionsSaveForWeb();
        pngOptions.format = SaveDocumentType.PNG;
        pngOptions.PNG8 = false; // PNG-24 (più qualità)

        doc.exportDocument(saveFilePNG, ExportType.SAVEFORWEB, pngOptions);

        // Chiude senza salvare modifiche
        doc.close(SaveOptions.DONOTSAVECHANGES);

        counter++;
    }

    alert("Fatto! " + (counter - 1) + " immagini elaborate in JPG e PNG.");
} else {
    alert("Cartelle non selezionate.");
}
