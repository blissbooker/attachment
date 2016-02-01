'use strict';

var mv = require('mv');
var rimraf = require('rimraf');
var mimes = require('mime-types');
var path = require('path');

var internals = {};

internals.resources = 'resources';

internals.expand = (prefix) => {

    return (id, file) => {

        const extension = mimes.extension(file.contentType);
        const filename = id + '.' + extension;

        return [prefix, internals.resources, filename].join(path.sep);
    };
};

module.exports = (config) => {

    const resourceUrl = internals.expand(config.url);
    const resourcePath = internals.expand(config.path);

    return {

        create(id, file, next) {
            const options = {
                mkdirp: true
            };

            mv(
                file.path,
                resourcePath(id, file),
                options,
                err => next(err, resourceUrl(id, file))
            );
        },

        remove(url, next) {
            rimraf(url.replace(config.url, config.path), next);
        }

    };
};
