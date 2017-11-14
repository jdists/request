"use strict";
const request = require("request");
const jsyaml = require("js-yaml");
module.exports = (function (content, attrs, scope) {
    if (!attrs.url) {
        throw 'Attribute "url" is undefined.';
    }
    return new Promise((resolve, reject) => {
        let options = {
            url: scope.execImport(attrs.url),
        };
        if (attrs.headers) {
            options.headers = jsyaml.safeLoad(scope.execImport(attrs.headers));
        }
        if (attrs.method) {
            options.method = attrs.method;
        }
        else {
            if (content) {
                options.method = 'POST';
            }
        }
        if (/^post$/i.test(options.method)) {
            options.form = jsyaml.safeLoad(content);
        }
        request(options, (err, req, body) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(body);
        });
    });
});
