var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const superagent = require('superagent')
require('superagent-charset')(superagent)
const cheerio = require('cheerio')

var getList = function (companyInfo) {
    return new Promise((resolve, reject) => {
        var url = 'https://www.tianyancha.com/search?key=' + companyInfo.name
        url = encodeURI(url)
        superagent.get(url)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
            .set('Accept-Encoding', 'gzip, deflate, br')
            .set('Accept-Language', 'zh-CN,zh;q=0.8')
            .set('Connection', 'keep-alive')
            .set('Cookie', 'aliyungf_tc=AQAAAFldvjEoSQQAhEVXdUAqHBLmFA6o; csrfToken=sORAcY_-vvwQgSc_TvH_dGyW; TYCID=5be0977013b311e9b8996745efeceb78; undefined=5be0977013b311e9b8996745efeceb78; ssuid=9158186000; __insp_wid=677961980; __insp_nv=true; __insp_targlpu=aHR0cHM6Ly93d3cudGlhbnlhbmNoYS5jb20v; __insp_targlpt=5aSp55y85p_lLeS6uuS6uumDveWcqOeUqOWVhuS4muWuieWFqOW3peWFt1%2FkvIHkuJrkv6Hmga%2Fmn6Xor6Jf5YWs5Y_45p_l6K_iX_W3peWVhuafpeivol%2FkvIHkuJrkv6HnlKjkv6Hmga%2Fmn6Xor6Lns7vnu58%3D; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1546999672; _ga=GA1.2.1170977959.1546999672; _gid=GA1.2.1118787539.1546999672; __insp_norec_sess=true; RTYCID=aa9aca9e6d8d44178ab36d478e6b489b; CT_TYCID=66fd8372e68247ecb822c928e59fc10a; _gat_gtag_UA_123487620_1=1; token=c175a4d92f3e41e69e9f7bc267b6d941; _utm=75d4598f130a47bdbb846004946ba5e2; tyc-user-info=%257B%2522claimEditPoint%2522%253A%25220%2522%252C%2522myQuestionCount%2522%253A%25220%2522%252C%2522explainPoint%2522%253A%25220%2522%252C%2522nickname%2522%253A%2522%25E7%2583%25AC%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522announcementPoint%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522discussCommendCount%2522%253A%25220%2522%252C%2522monitorUnreadCount%2522%253A%2522112%2522%252C%2522onum%2522%253A%25220%2522%252C%2522claimPoint%2522%253A%25220%2522%252C%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzI3MDM1MDM3MiIsImlhdCI6MTU0NzAwMDk2NiwiZXhwIjoxNTYyNTUyOTY2fQ.3mJQsXV-s-pMPIHCBEaAFMlUNhhmv2H1c9VZRAB_DDAEIoSaPt0OToPIvBvmnjyFBGzr33o0J12KF4aw7Asirg%2522%252C%2522redPoint%2522%253A%25220%2522%252C%2522pleaseAnswerCount%2522%253A%25220%2522%252C%2522bizCardUnread%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213270350372%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzI3MDM1MDM3MiIsImlhdCI6MTU0NzAwMDk2NiwiZXhwIjoxNTYyNTUyOTY2fQ.3mJQsXV-s-pMPIHCBEaAFMlUNhhmv2H1c9VZRAB_DDAEIoSaPt0OToPIvBvmnjyFBGzr33o0J12KF4aw7Asirg; cloud_token=8e1a1f564c0343d98aff7b6903dad695; cloud_utm=572fdc836007439da38951a5b5ec416c; __insp_slim=1547000992500; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1547000993')
            .set('Host', 'www.tianyancha.com')
            .set('Referer', 'https://www.tianyancha.com/search?key=%E5%BE%90%E5%B7%9E%E5%BE%B7%E5%B1%95')
            .set('Upgrade-Insecure-Requests', '1')
            .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36')
            .end(async function (err, res) {
                if (err) {
                    reject(err);
                    return
                }
                var $ = cheerio.load(res.text);
                //防爬虫
                if ($('div.wapHeader').length > 0) {
                    reject(err);
                    return
                }

                if ($('div.search-result-single').length == 0) {
                    companyInfo.found = '不存在'
                    companyInfo.money = ''
                    resolve(companyInfo);
                    return
                }
                let company = $('div.search-result-single').eq(0)
                let money = company.find('.title').eq(1).find('span').text()
                companyInfo.found = 1
                companyInfo.money = money
                resolve(companyInfo);
                return
                // let person = company.find('.title').eq(0).text()
                // if (person.slice(0, 1) == '法') {
                //     person = person.slice(6)
                //     if (person == companyInfo.person) {
                //         companyInfo.found = 1
                //         companyInfo.money = money
                //         resolve(companyInfo);
                //         return
                //     }
                // }

                // if (companyInfo.found != 1) {
                //     var href = company.find('a.name').attr('href')
                //     await getCompany(companyInfo, url, href).then(companyInfo => {
                //         if (companyInfo.tongyi == companyInfo.tyxy || companyInfo.zzjg == companyInfo.zuzhi) {
                //             companyInfo.found = 1
                //             companyInfo.money = money
                //             resolve(companyInfo);
                //             return
                //         }
                //     }).catch(e => {
                //         //console.log(e,res.text)
                //     });
                // }
                // companyInfo.found = '不匹配'
                // resolve(companyInfo);
                // return
            });
    })
}

var getCompany = function (companyInfo, url, href) {
    return new Promise((resolve, reject) => {
        superagent.get(href)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
            .set('Accept-Encoding', 'gzip, deflate, br')
            .set('Accept-Language', 'zh-CN,zh;q=0.9')
            .set('Cache-Control', 'max-age=0')
            .set('Connection', 'keep-alive')
            .set('Cookie', 'aliyungf_tc=AQAAAFldvjEoSQQAhEVXdUAqHBLmFA6o; csrfToken=sORAcY_-vvwQgSc_TvH_dGyW; TYCID=5be0977013b311e9b8996745efeceb78; undefined=5be0977013b311e9b8996745efeceb78; ssuid=9158186000; __insp_wid=677961980; __insp_nv=true; __insp_targlpu=aHR0cHM6Ly93d3cudGlhbnlhbmNoYS5jb20v; __insp_targlpt=5aSp55y85p_lLeS6uuS6uumDveWcqOeUqOWVhuS4muWuieWFqOW3peWFt1%2FkvIHkuJrkv6Hmga%2Fmn6Xor6Jf5YWs5Y_45p_l6K_iX_W3peWVhuafpeivol%2FkvIHkuJrkv6HnlKjkv6Hmga%2Fmn6Xor6Lns7vnu58%3D; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1546999672; _ga=GA1.2.1170977959.1546999672; _gid=GA1.2.1118787539.1546999672; __insp_norec_sess=true; RTYCID=aa9aca9e6d8d44178ab36d478e6b489b; CT_TYCID=66fd8372e68247ecb822c928e59fc10a; _gat_gtag_UA_123487620_1=1; token=c175a4d92f3e41e69e9f7bc267b6d941; _utm=75d4598f130a47bdbb846004946ba5e2; tyc-user-info=%257B%2522claimEditPoint%2522%253A%25220%2522%252C%2522myQuestionCount%2522%253A%25220%2522%252C%2522explainPoint%2522%253A%25220%2522%252C%2522nickname%2522%253A%2522%25E7%2583%25AC%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522announcementPoint%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522discussCommendCount%2522%253A%25220%2522%252C%2522monitorUnreadCount%2522%253A%2522112%2522%252C%2522onum%2522%253A%25220%2522%252C%2522claimPoint%2522%253A%25220%2522%252C%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzI3MDM1MDM3MiIsImlhdCI6MTU0NzAwMDk2NiwiZXhwIjoxNTYyNTUyOTY2fQ.3mJQsXV-s-pMPIHCBEaAFMlUNhhmv2H1c9VZRAB_DDAEIoSaPt0OToPIvBvmnjyFBGzr33o0J12KF4aw7Asirg%2522%252C%2522redPoint%2522%253A%25220%2522%252C%2522pleaseAnswerCount%2522%253A%25220%2522%252C%2522bizCardUnread%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213270350372%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzI3MDM1MDM3MiIsImlhdCI6MTU0NzAwMDk2NiwiZXhwIjoxNTYyNTUyOTY2fQ.3mJQsXV-s-pMPIHCBEaAFMlUNhhmv2H1c9VZRAB_DDAEIoSaPt0OToPIvBvmnjyFBGzr33o0J12KF4aw7Asirg; cloud_token=8e1a1f564c0343d98aff7b6903dad695; cloud_utm=572fdc836007439da38951a5b5ec416c; __insp_slim=1547000992500; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1547000993')
            .set('Host', 'www.tianyancha.com')
            .set('Referer', url)
            .set('Upgrade-Insecure-Requests', '1')
            .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36')
            .end(function (err, res) {
                let $ = cheerio.load(res.text);

                //工商注册号
                // let gszc = $('table.-striped-col tr').eq(0).find('td').eq(1).text()
                // if (gszc) {
                //     companyInfo.gszc = gszc
                // }

                //组织机构代码
                let zzjg = $('table.-striped-col tr').eq(0).find('td').eq(3).text()
                if (zzjg) {
                    companyInfo.zzjg = zzjg
                }

                //统一信用代码
                let tyxy = $('table.-striped-col tr').eq(1).find('td').eq(1).text()
                if (tyxy) {
                    companyInfo.tyxy = tyxy
                }

                //注册地址
                // let address1 = $('td[colspan="4"]').eq(0)[0]
                // if (address1) {
                //     companyInfo.address1 = address1.childNodes[0].data
                // }
                //companyInfo.address2 = $('span.address').attr('title')//地址
                return resolve(companyInfo);
            });
    })
}

module.exports = getList
