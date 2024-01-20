const fs = require('node:fs');
const fsPromises = require("fs/promises");
const path = require('node:path');
const dirPath = './06-build-page';

function errNotify(err) {
  if (err && err.code !== "EEXIST") console.log(err);
}

function bundleStyle(from, to) {
  const stream = fs.createWriteStream(`${to}/style.css`);
  fs.readdir(from, (err, files) => {
    errNotify(err);
    files.forEach((file) => {
      if (path.extname(file) === '.css') {
        fs.readFile(`${from}/${file}`, (err, data) => {
          errNotify(err);
          stream.write(`/* Styles from the ${file} */\n${data}\n`);
        });
      }
    });
  });
}

function copyDir(from, to) {
  fs.rm(to, { recursive: true, force: true }, (err) => {
    errNotify(err);
    fs.mkdir(to, errNotify);
    fs.readdir(from, (err, files) => {
      errNotify(err);
      files.forEach((file) => {
        fs.stat(`${from}/${file}`, (err, stats) => {
          errNotify(err);
          if (stats.isFile()) {
            fs.copyFile(`${from}/${file}`, `${to}/${file}`, errNotify);
          } else if (stats.isDirectory()) {
            copyDir(`${from}/${file}`, `${to}/${file}`);
          }
        });
      });
    });
  });
}

async function componentsSetup(callback) {
  const components = {};
  const files = await fsPromises.readdir(`${dirPath}/components`);
  for (const file of files) {
    if (path.extname(file) === '.html') {
      const data = await fsPromises.readFile(`${dirPath}/components/${file}`);
      components[`{{${path.basename(file, '.html')}}}`] = data.toString();
    }
  }
  callback(components);
}

function buildHTML(dest) {
  fs.mkdir(dest, errNotify);
  bundleStyle(`${dirPath}/styles`, dest);
  copyDir(`${dirPath}/assets`, `${dest}/assets`);

  componentsSetup((components) => {
    fs.readFile(`${dirPath}/template.html`, (err, data) => {
      errNotify(err);
      let html = data.toString();
      Object.keys(components).forEach((key) => {
        while (html.includes(key)) {
          html = html.replace(key, components[key]);
        }
      });
      const writer = fs.createWriteStream(`${dest}/index.html`);
      writer.write(html);
    });
  });
}

buildHTML(`${dirPath}/project-dist`);
