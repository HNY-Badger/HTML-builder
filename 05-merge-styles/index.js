const fs = require('node:fs');
const path = require('node:path');

function errorNotifier(err) {
  if (err) console.log(err);
}

function bundleStyle(from, to) {
  const stream = fs.createWriteStream(`${to}/bundle.css`);
  fs.readdir(from, (err, files) => {
    errorNotifier(err);
    files.forEach((file) => {
      if (path.extname(file) === '.css') {
        fs.readFile(`${from}/${file}`, (err, data) => {
          errorNotifier(err);
          console.log(`Bundling ${file}...`);
          stream.write(`/* Styles from the ${file} */\n${data}\n`);
        });
      }
    });
  });
}

bundleStyle('./05-merge-styles/styles', './05-merge-styles/project-dist');
