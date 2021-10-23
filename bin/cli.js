#!/usr/bin/env node
var fs = require('fs');
var toJSON = require('../');

if (process.argv.slice(2).join(' ') === '-h') {
    console.log('Usage: shp2json {infile|-} {outfile|-}');
    process.exit(0);
}

var outFile = process.argv[3] || '-';
var outStream = outFile === '-'
    ? process.stdout
    : fs.createWriteStream(outFile)
;

var inFile = process.argv[2] || '-';
if (/\.shp$/.test(inFile)) {
    var duplexify = require('duplexify');
    var d = duplexify.obj();
    d.pipe(outStream);
    toJSON.fromShpFile(inFile, d);
} else {
    var inStream = inFile === '-'
        ? process.stdin
        : fs.createReadStream(inFile)
    ;
    var converter = toJSON(inStream)
    converter.on('error', function(e) {
        console.error('Error:', e)
    })
    converter.pipe(outStream);
}
