const fs = require('node:fs');
const stream = fs.createWriteStream('./02-write-file/text.txt', { flags: "a" });

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });
stream.on("open", () => {
  console.log('Ready to accept your lines...');
})
rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
    return;
  }
  stream.write(`${input}\n`);
});
rl.on('close', () => {
  console.log('Have a nice day! :)');
  stream.close();
});
