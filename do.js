var express = require('express');
var FormData = require('form-data');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const superagent = require('superagent')
require('superagent-charset')(superagent)
const cheerio = require('cheerio')

var list = {
    '030000222':'07',
    '030000019':'02',
    '030200533':'01',
    '030200069':'09',
    '030300069':'05',
    '030500039':'01',
    '032100502':'01',
    '032100583':'01',
    '032100010':'01',
    '032200533':'01',
    '038100509':'01',
    '038100030':'11',
    '038200509':'02',
    '038200081':'02',
    
}


function exist(a,b){
    for (var key in list) {
        //f(a.indexOf(key)>-1){
        var aa = a.slice(a.length-10,a.length-1)
        if(aa===key){
            var element = list[key];
            if(b.indexOf(element)>-1){
                return true
            }
        }
    }
    return false
}
function main() {
    console.log('报名成功人数\t部门名称\t职位名称\t开考比例\t招考人数\t报名成功人数')

    superagent.get('http://218.3.167.181:8001/Home/RegBrowse?examid=00180111113752')
    .set('Accept','text/html, application/xhtml+xml, */*')
    .set('Accept-Language','zh-CN')
    .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko')
    .set('Accept-Encoding','gzip, deflate')
    .set('Host','218.3.167.181:8001')
    .set('Connection','keep-alive')
    .set('Cookie','ant_stream_5335959409ecd=1517509245/605101608; UM_distinctid=16150e6fd2f36f-01dfc8c9064c8d8-5d5e490e-1fa400-16150e6fd30b1c; ASP.NET_SessionId=tmpng5mj2mb5f4yrs2k52ymt; __RequestVerificationToken_Lw__=JR4Xr9hDvv1HrEC5pVoFH1TZh9jciwH595VD5GLrsUSAE31IqjdKDt0AWu65Dn58nNuonSrLu4qkPTm1UKoNOJY4NLQ9quKEm6qaEpTyYJI=; CNZZDATA5017486=cnzz_eid%3D329915842-1517476527-http%253A%252F%252F218.3.167.181%253A8001%252F%26ntime%3D1517487327; bow_stream_5335959409ecd=13')
    .end(function (err, res) {
      var $ = cheerio.load(res.text);

        $('#jobAreaList option').each((i,v) => {
            if(i!=0){
                //$('#jobAreaList').val($(v).val())
                var data = {'jobAreaList':$(v).val()}
                superagent.post('http://218.3.167.181:8001/Home/RegBrowse?examid=00180111113752')
                .set('Accept','text/html, application/xhtml+xml, */*')
                .set('Accept-Language','zh-CN')
                .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko')
                .set('Accept-Encoding','gzip, deflate')
                .set('Host','218.3.167.181:8001')
                .set('Connection','keep-alive')
                .set('Cookie','ant_stream_5335959409ecd=1517509245/605101608; UM_distinctid=16150e6fd2f36f-01dfc8c9064c8d8-5d5e490e-1fa400-16150e6fd30b1c; ASP.NET_SessionId=tmpng5mj2mb5f4yrs2k52ymt; __RequestVerificationToken_Lw__=JR4Xr9hDvv1HrEC5pVoFH1TZh9jciwH595VD5GLrsUSAE31IqjdKDt0AWu65Dn58nNuonSrLu4qkPTm1UKoNOJY4NLQ9quKEm6qaEpTyYJI=; CNZZDATA5017486=cnzz_eid%3D329915842-1517476527-http%253A%252F%252F218.3.167.181%253A8001%252F%26ntime%3D1517487327; bow_stream_5335959409ecd=13')
                .type('form')
                .send(data)
                .end(function (err, res) {
                    var $ = cheerio.load(res.text);

                    $('.tableline tr').each((i,v) => {
                        if(i!=0){
                            var a = $(v).find('td').eq(0).text().trim()
                            var b = $(v).find('td').eq(1).text().trim()
                            if(exist(a,b)){
                                var c = $(v).find('td').eq(4).text().trim()+'\t'
                                var t=[c]
                                $(v).find('td').each((i,vv) => {
                                    t.push($(vv).text().trim()+'\t')
                                })
                                console.log(t.join(''))
                            }
                        }
                    })
                })
            } 
        })
    })
}
main()
