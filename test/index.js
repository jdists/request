
const http = require('http')
let server = http.createServer(function (req, res) {
  res.write(JSON.stringify({
    header: req.headers,
    method: req.method,
    url: req.url,
  }))
  res.end()
}).listen(18081)

global.processor = require('../')
      

describe("src/index.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("processor():base", function () {
    examplejs_printLines = [];
  let attrs = {
    url: 'https://www.baidu.com/',
  }
  let scope = {
    execImport: function (importion) {
      return importion
    },
  }

  processor(null, attrs, scope).then(function (content) {
    examplejs_print(content.indexOf('百度一下，你就知道') >= 0)
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  }).catch(function (err) {
    console.error(err)
    throw err
  })
  });
          
  it("processor():post", function (done) {
    examplejs_printLines = [];
  let attrs = {
    url: 'http://localhost:18081/',
    headers: `
      token: 123
    `
  }
  let scope = {
    execImport: function (importion) {
      return importion
    },
  }

  processor('x: 1', attrs, scope).then(function (content) {
    let obj = JSON.parse(content)
    examplejs_print(obj.header.token)
    assert.equal(examplejs_printLines.join("\n"), "123"); examplejs_printLines = [];
    examplejs_print(obj.method)
    assert.equal(examplejs_printLines.join("\n"), "POST"); examplejs_printLines = [];
    done();
  }).catch(function (err) {
    console.error(err)
    throw err
  })
  });
          
  it("processor():error", function () {
    examplejs_printLines = [];
  let attrs = {
    url: 'http://127.0.0.1:29999/!e!r!r',
    method: 'GET',
  }
  let scope = {
    execImport: function (importion) {
      return importion
    },
  }

  processor(null, attrs, scope).then(function (content) {
    throw 'case err'
  }).catch(function (err) {
    examplejs_print(!!err)
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  })
  });
          
  it("processor():content is null", function () {
    examplejs_printLines = [];

  (function() {
  let attrs = {}
  let scope = {}
  processor(null, attrs, scope)
  // * throw
  }).should.throw();
  });
          
});
         