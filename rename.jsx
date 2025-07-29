//#target photoshop

var inputFolder = Folder.selectDialog("Scegli la cartella con i file .webp da rinominare");
var outputFolder = Folder.selectDialog("Scegli la cartella di destinazione per i file rinominati");

if (inputFolder && outputFolder) {
    var files = inputFolder.getFiles(/\.(webp)$/i);
    var baseName = "appartamento-laquila-affitti-brevi-alessia-grillo";
    var counter = 1;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!(file instanceof File)) continue;

        var newFileName = baseName + "-" + counter + ".webp";
        var newFile = new File(outputFolder + "/" + newFileName);

        // Copia il file (o usa file.rename() se vuoi spostare/renominare in place)
        file.copy(newFile);

        counter++;
    }

    alert("Rinominati " + (counter - 1) + " file.");
} else {
    alert("Cartelle non selezionate.");
}
