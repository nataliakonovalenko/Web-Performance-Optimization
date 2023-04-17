const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const RESOLUTIONS = [320, 768, 1024, 1920];
const IMAGE_INPUT_PATH = path.resolve(__dirname, '../src/images');
const IMAGE_OUTPUT_PATH = path.resolve(__dirname, '../build/images');

if (!fs.existsSync(IMAGE_OUTPUT_PATH)){
  fs.mkdirSync(IMAGE_OUTPUT_PATH, { recursive: true });
}

function getExtension(filename) {
  let ext = path.extname(filename || '').split('.');

  return ext[ext.length - 1]
}

const filenames = fs.readdirSync(IMAGE_INPUT_PATH);

filenames.forEach((file) => {
  const fileExtension = getExtension(file);
  const fileName = file.split(".")[0];

  const fullFilePath = path.resolve(__dirname, IMAGE_INPUT_PATH, file);

  let sh = sharp(fullFilePath);

  if (fileExtension === "jpg" || fileExtension === 'jpeg' || fileExtension === 'png') {
    RESOLUTIONS.forEach((resolution) => {
      const name = `${fileName}-${resolution}`
      const filePath = path.join(IMAGE_OUTPUT_PATH, name);

      sh.resize({ width: resolution }).webp().toFile(`${filePath}.webp`);

      if (fileExtension === 'png') {
        sh.resize({ width: resolution }).toFile(`${filePath}.${fileExtension}`);
      } else {
        sh.resize({ width: resolution }).jpeg({ quality: 80 }).toFile(`${filePath}.${fileExtension}`);
      }
    });
  } else {
    console.log('unknown image extension type');
  }
});
