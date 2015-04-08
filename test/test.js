var UAParser=require('../src/ua-parser.js');
var assert=require('assert');

describe('User-Agents', function(){
  var UAs=[
    {
      ua: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36 OPR/28.0.1750.48',
      res: {
        os: 'Windows 8.1',
        browser: 'Opera 28.0.1750.48',
      }
    }
  ];

  it('Test User-Agents', function(){
    UAs.forEach(function(item){
      var res=UAParser.parse(item.ua);
      assert.equal(UAParser.getString(res.os), item.res.os);
      assert.equal(UAParser.getString(res.browser), item.res.browser);
    })
  })
});
