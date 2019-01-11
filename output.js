var xlsx = require('node-xlsx');
var fs = require('fs');
var os = require('os');
var jsonFile = fs.readFileSync('./json.json','utf-8')
jsonFile = JSON.parse(jsonFile)
var array = []
jsonFile.forEach(c => {
  array.push([c.name,c.address1,c.gszc,c.zzjg,c.tyxy,c.phone])
});

var data1 = [{
  name: 'sheet1',
  data:array}]

  var buffer = xlsx.build(data1);
  fs.writeFile('./resut.xlsx', buffer, function(err) {
    if (err) throw err;
    console.log('has finished');
  });
