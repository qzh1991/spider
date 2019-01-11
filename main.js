var 经济普查 = require('./经济普查')
var xlsx = require('node-xlsx');
var readline = require('readline');
var fs = require('fs');
var os = require('os');
var communities = xlsx.parse("./同昌1.8法人单位out.xls")
var file = '同昌1.8法人单位out.xls'


// var companies = JSON.parse(fs.readFileSync('./json.json'));
// var fReadName = fs.createReadStream('./企业列表.txt');
// var fReadAddress = fs.createReadStream('./地址列表.txt');
// var fWriteAddress = fs.createWriteStream('./地址列表2.txt');

//读企业
// var objReadline = readline.createInterface({
//     input: fReadName,
//     // 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用
//     // 但文件末尾会多算一次index计数   sodino.com
//     //  output: fWrite, 
//     //  terminal: true
// });

//读地址
// var objReadline1 = readline.createInterface({
//     input: fReadAddress,
//     // 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用
//     // 但文件末尾会多算一次index计数   sodino.com
//     //  output: fWrite, 
//     //  terminal: true
// });

// var read1index=read1index1=0

// objReadline.on('line', (line) => {
//     if(!companies[read1index]){
//         let company={
//             num:read1index,
//             name:line,
//             address1:'',
//             address2:'',
//             gszc:'',
//             zzjg:'',
//             tyxy:''
//         }
//         companies[read1index]=company
//     }else{
//         companies[read1index].name=line
//     }
//     read1index++
// });

// objReadline1.on('line', (line) => {
//     if(!companies[read1index1]){
//         let company={
//             num:read1index1,
//             name:'',
//             address1:line,
//             address2:'',
//             gszc:'',
//             zzjg:'',
//             tyxy:''
//         }
//         companies[read1index1]=company
//     }else{
//         companies[read1index1].address1=line
//     }
//     read1index1++
// });

// objReadline.on('close', () => {
//     console.log('closed')
// });

// objReadline1.on('close', () => {
//     console.log('1closed')
//     console.log(companies)
//     fot()
// });
var sum = 0, count = 0
async function main() {
    for (let i = 0; i < communities.length; i++) {
        let companies = communities[i].data
        for (let j = 1; j < companies.length; j++) {
            sum++
            let company = companies[j];
            let companyInfo = {
                i: i,
                j: j,
                no: i + communities[i].name + '-' + j,
                found: company[8],
                tongyi: company[1],
                zuzhi: company[2],
                name: company[3].replace('（本部）', ''),
                person: company[4]
            }
            if (companyInfo.found != 1) {
                try {
                    await 经济普查(companyInfo)
                    count++
                    calc(companyInfo)
                } catch (error) {
                    console.log(error)
                    debugger
                    j--
                }
            }
        }
    }
    output()
}
function calc(companyInfo) {
    let c = communities[companyInfo.i].data[companyInfo.j]
    c[8] = companyInfo.found
    c[9] = companyInfo.money
    let tmp = companyInfo.no + '-' + companyInfo.name + ':' + companyInfo.money
    console.log(tmp)
    if (count % 10 == 0) {
        output()
    }
}
function output() {
    var buffer = xlsx.build(communities);
    fs.writeFile(file, buffer, function (err) {
        if (err)
            throw err
        console.log(file + '写入成功');
    })
}
main()