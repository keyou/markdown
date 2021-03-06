/************************************************ 
     
    file:       markdown.js
    author:     keyou
    date:       2016/5/10
    mission:    parse markdown file.
    license:    MIT License
    
*************************************************/
(function (expose) {
    var markdown = expose;
    
    require("./tools.js");

    //var md = require("markdown");
    //var html = md.parse(data);

    var preSplit = /\n*(`{3,}.*\n[\S\s]*?\n`{3,})\n*/g; // presplit

    var codeRgx = /\n*`{3,}(.*)\n([\S\s]*)?\n`{3,}\n*/g; // code 
    var paragraph = /\n(?:\s*\n)+|  \n(?:\s*\n)*/g; // paragraph
    var titleRgxs = [/^\s*(#{1,6})\s*([\S\s]*)$/, /^\s*([\S\s]*?)\n[-=]{4,}\s*$/]; // title
    var listRgx = /^\s*([\*>-])\.? (.*(?:\n(?!\1).+)*)$/mg; // list
    var sortListRgx = /^\s*(\d)\.? (.*(?:\n(?!\d).+)*)$/mg; // sort list
    var refRgx = /^\s*\[(.*?)\]:\s*(.*)\s*$/mg; // ref list
    //var listSplit = /^\s*([\da-zA-Z\*>])\.{0,1} /m;

    var styleRgx = /([_*`]{1,2})([\S\s]*?[^\\])\1/g; // inlines
    var linkRgx = /!{0,1}\[([^\[\]]*)\](\((?:[^\(\)]|\(.*?\))*?\)|\[[^\[\]]*\])/g; // link and image
    var dataRgx = new RegExp(styleRgx.source + "|" + linkRgx.source, "g");

    var styleSplit = /^[_*`]{1,2}$/;

    var spaceData = /^\s*$/;

    var cssDic = { "**": "strong", "*": "em", "__": "strong", "_": "em", "`": "code", "``": "code" };

    function _parseStyle(p) {
        var rlt;
        while ((rlt = styleRgx.exec(p))) {
            styles.push({ type: "css", index: rlt.index, length: rlt[0].length });
            console.log("Style: " + rlt[1] + " " + rlt[2]);

        }
    }

    function analyseData(p) {
        var datas = [];
        var rlt;
        var data = p;
        dataRgx.lastIndex = 0;
        if ((rlt = dataRgx.exec(data))) {
            if (rlt.index > 0) {
                datas.push(data.substr(0, rlt.index));
            }
            data = data.substr(dataRgx.lastIndex);
            if (rlt[1]) {
                datas.push({ type: "css", key: rlt[1], value: analyseData(rlt[2]) });
            }
            else if (rlt[3]) {
                if (rlt[0].startWith("!")) {
                    datas.push({ type: "image", key: rlt[4], value: analyseData(rlt[3]) });
                }
                else {
                    datas.push({ type: "link", key: rlt[4], value: analyseData(rlt[3]) });
                }
            }
            if (data) {
                datas = datas.concat(analyseData(data));
            }
        }
        else {
            datas = p;
        }

        return datas;
    }

    function parse2Json(p) {
        var pa = {};
        var isOK = false;

        console.log("_______" + p.substr(0, 20));

        var rlt = p.match(titleRgxs[0]);
        if (!isOK && rlt) {
            console.log("Title: " + rlt[1]);
            pa.type = "title";
            pa.ref = rlt[1];
            pa.data = analyseData(rlt[2]);
            isOK = true;
        }

        if (!isOK && (rlt = p.match(titleRgxs[1]))) {
            console.log("Title: " + rlt[1]);
            pa.type = "title";
            pa.ref = "#";
            pa.data = analyseData(rlt[1]);
            isOK = true;
        }

        if (!isOK && (rlt = listRgx.exec(p))) {
            pa.type = "list";
            pa.ref = rlt[1];
            pa.data = [];
            listRgx.lastIndex = 0;
            while ((rlt = listRgx.exec(p))) {
                console.log("List: " + rlt[1] + " " + rlt[2]);
                //var tmp = {};
                //tmp.key = rlt[1];
                //tmp.value = rlt[2];
                //tmp.style = analyseData(rlt[2]);
                pa.data.push(analyseData(rlt[2]));
            }
            isOK = true;
        }

        if (!isOK && (rlt = sortListRgx.exec(p))) {
            pa.type = "sortlist";
            pa.ref = rlt[1];
            pa.data = [];
            sortListRgx.lastIndex = 0;
            while ((rlt = sortListRgx.exec(p))) {
                console.log("SortList: " + rlt[1] + " " + rlt[2]);
                //var tmp = {};
                //tmp.key = rlt[1];
                //tmp.value = rlt[2];
                //tmp.style = analyseData(rlt[2]);
                pa.data.push(analyseData(rlt[2]));
            }
            isOK = true;
        }

        if (!isOK && (rlt = refRgx.test(p))) {
            pa.type = "ref";
            pa.data = [];
            refRgx.lastIndex = 0;
            while (rlt = refRgx.exec(p)) {
                console.log("Ref: " + rlt[1] + " " + rlt[2]);
                var tmp = {};
                tmp.key = rlt[1];
                tmp.value = rlt[2];
                pa.data.push(tmp);
            }
            isOK = true;
        }

        if (!isOK && (rlt = codeRgx.exec(p))) {
            console.log("Code: " + rlt[1] + "\n" + rlt[2]);
            pa.type = "code";
            pa.data = rlt[2];
            pa.ref = rlt[1];
            isOK = true;
        }

        if (!isOK) {
            pa.type = "plain";
            //pa.data = p;
            pa.data = analyseData(p);
        }

        console.log(JSON.stringify(pa));
        return pa;
    }

    function escapeHTML(text) {
        return text.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function escapeLink(key, refs) {
        var type = key.substr(0, 1);
        var key = key.substr(1, key.length - 2);
        refs = refs || [];
        if (type == "(") {
            return key;
        }
        if (type == "[") {
            for (var i = 0; i < refs.length; i++) {
                var refobj = refs[i];
                if (refobj.key == key) {
                    return refobj.value;
                }
            }
        }
        return "#" + key;
    }

    function parseHtml(datas, refs) {
        var html = "";
        if (datas instanceof Array) {
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                if (typeof data === "string") {
                    html += data;
                }
                else {
                    switch (data.type) {
                        case "image": {
                            html += '<img src="{0}" alt="{1}" />'.format(escapeLink(data.key, refs), data.value)
                            break;
                        }
                        case "link": {
                            html += "<a href='{0}'>{1}</a>".format(escapeLink(data.key, refs), parseHtml(data.value));
                            break;
                        }
                        case "css": {
                            html += "<{0}>{1}</{0}>".format(cssDic[data.key], parseHtml(data.value));
                            break;
                        }
                    }
                }
            }
        }
        else {
            html = escapeHTML(datas);
        }
        return html;
    }

    function json2Html(p, refs) {
        var html = "";

        switch (p.type) {
            case "title": {
                html += "<h{0}>{1}</h{0}>".format(p.ref.length, parseHtml(p.data, refs));
                break;
            }
            case "sortlist":
            case "list": {
                html += "<ol>"
                for (var i = 0; i < p.data.length; i++) {
                    var data = p.data[i];
                    html += "<li>{0}</li>".format(parseHtml(data, refs));
                }
                html += "</ol>";
                break;
            }
            case "code": {
                html += "<pre><code>{0}</code></pre>".format(escapeHTML(p.data));
                break;
            }
            case "plain": {
                html += "<p>{0}</p>".format(parseHtml(p.data, refs));
                break;
            }
            case "": {
                break;
            }
        }

        console.log("------------------------------------");
        console.log(html);
        return html;
    }

    function parse2Jsons(data) {
        data = data.replace(/\r\n/g, "\n");
        data = data.split(preSplit);
        var jsons = [];

        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (preSplit.test(d)) {
                console.log("=====================");
                jsons.push(parse2Json(d));
                //json2Html(jsons[jsons.length-1]);
            }
            else {
                var paras = d.split(paragraph);
                paras.forEach(function (e) {
                    if (spaceData.test(e)) return;
                    console.log("=====================");
                    var js = parse2Json(e);
                    if (js.type && js.type == "ref") {
                        jsons.unshift(js);
                    }
                    else {
                        jsons.push(js);
                    }
                    //json2Html(jsons[jsons.length-1]);
                }, paras);
            }
        }
        return jsons;
    }

    function jsons2Html(jsons) {
        var html = "";
        var refs = [];
        if(!jsons||!(jsons instanceof Array)) return html;
        for (var i = 0; i < jsons.length; i++) {
            var json = jsons[i];
            if (json.type && json.type == "ref") {
                var d = json.data;
                refs = refs.concat(d);
            }
            else {
                html += json2Html(json, refs) + "\n";
            }
            //console.log(json);
        }
        return html;
    }

    markdown.parse = function (data) {
        var jsons = parse2Jsons(data);
        var html = jsons2Html(jsons);
        return html;
    };
    
    //return markdown;
/*
    function test() {
        
        var fs = require("fs");
        var data = fs.readFileSync("sample.md", "utf-8");
        var jsons = parse2Jsons(data);
        var html = jsons2Html(jsons);

        var htmlTemplate = fs.readFileSync("result.html", "utf-8");
        fs.writeFileSync("rlt.html", htmlTemplate.format(html));
        
        //console.log(html);
    }

    test(data);
*/
})((function() {
  if ( typeof exports === "undefined" ) {
    window.markdown = {};
    return window.markdown;
  }
  else {
    return exports;
  }
} )() );
