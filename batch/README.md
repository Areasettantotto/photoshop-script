
# Photoshop Batch Scripts

This folder contains a collection of Photoshop `.jsx` scripts
designed to automate repetitive image tasks.

## 📂 Contents

- **`applying-the-watermark.jsx`**
  Inserts a logo/brand at the bottom right of all images in a folder and its subfolders.
  ➡️ Useful for adding a consistent watermark to image sets while preserving originals and folder structure.

- **`prepare-typography-package.jsx`**
  Prepares typography packages by merging layers, setting resolution to **300 dpi**,
  converting images to **CMYK**, and saving the result as **TIFF** files (without
  overwriting the originals).
  ➡️ Useful for preparing high-resolution print-ready files from multiple input formats (JPG, PNG, TIFF, BMP).

- **`rename-webp.jsx`**
  Renames and copies `.webp` files using a base name + sequential number.
  ➡️ Useful for creating image sets with SEO-friendly filenames.

- **`resize-export-multiple.jsx`**
  Resizes images to **multiple predefined sizes** (1000 → 100 px, 100px steps).
  Exports each version as **JPG** and **PNG-24**.
  ➡️ Useful for preparing responsive images or web galleries.

- **`resize-export-1000px.jsx`**
  Resizes images to a **maximum width of 1000px** (keeps aspect ratio, no upscaling).
  Exports to **JPG** and **PNG-24**.
  ➡️ Useful for getting standardized versions without multiplying formats.

---

## 🚀 Usage

1. Open **Adobe Photoshop**
2. Go to `File > Scripts > Browse...`
3. Select the desired `.jsx` script from the `batch/` folder
4. Follow the dialogs to:
   - Select the **input folder**
   - Select the **output folder**
   - Wait for the automatic processing

---

## 📝 Notes

- The scripts do not overwrite original files: they operate on copies saved to the output folder.
- JPG quality is set to **80** (good quality/size trade-off).
- PNG exports use **PNG-24** (maximum quality).
- All scripts avoid **upscaling**: if an image is smaller than the target width, it will not be enlarged.

---

## 👨‍💻 Author
Scripts created by **Marco Busato** for Photoshop batch workflows.

