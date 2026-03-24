const newman = require('newman');
const fs = require('fs');
const path = require('path');

const collectionsDir = './collections';
const environment = './environments/devGoRest.postman_environment.json';

const collections = fs.readdirSync(collectionsDir)
  .filter(file => file.endsWith('.postman_collection.json'))
  .map(file => path.join(collectionsDir, file));

console.log('\nFound ' + collections.length + ' collection(s) to run:\n');
collections.forEach((col, index) => {
  console.log('  ' + (index + 1) + '. ' + path.basename(col));
});
console.log('\n');

let currentIndex = 0;

function runNextCollection() {
  if (currentIndex >= collections.length) {
    console.log('\nAll collections completed.\n');
    return;
  }

  const collection = collections[currentIndex];
  console.log('\nRunning: ' + path.basename(collection) + '\n');

  const options = {
    collection: collection,
    environment: environment,
    reporters: ['cli']
  };

  if (path.basename(collection).toLowerCase().includes('end-to-end')) {
    options.iterationData = './data/InputTestData.csv';
  }

  newman.run(options, function (err) {
    if (err) {
      console.error('\nError in ' + path.basename(collection) + ':', err);
      process.exit(1);
    }
    
    currentIndex++;
    runNextCollection();
  });
}

runNextCollection();