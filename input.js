var xlsx = require('node-xlsx');
var fs = require('fs');
var os = require('os');

var list1 = xlsx.parse("./同昌1.8法人单位.xls")
var list2 = xlsx.parse("./out.xls")
console.log('ok')
