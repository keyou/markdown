console.log("app.js");

var fs = require("fs");
var data = fs.readFileSync("sample.md", "utf-8");

var markdown = require('markdown')
    //var rlt = markdown.parse(data);

var md = require("./markdown.js")


var html = md.parse(data);

var htmlTemplate = fs.readFileSync("result.html", "utf-8");
fs.writeFileSync("rlt.html", htmlTemplate.format(html));

//console.log(html);