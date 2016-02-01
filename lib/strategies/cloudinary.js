'use strict';

let cloudinary;
const mimes = require('mime-types');
const last = require('lodash').last;

module.exports = (config) => {

    //jshint camelcase: false
    cloudinary = config.cloudinary || require('cloudinary');
    cloudinary.config(config);

    const url = (id, file) => cloudinary.url(id, {
        secure: config.secure,
        cdn_subdomain: true,
        secure_cdn_subdomain: true,
        format: mimes.extension(file.contentType)
    });

    const create = (id, file, next) => {

        const onResponse = (result) => {

            if (result.error) {
                return next(new Error(result.error));
            }

            next(null, url(id, file));
        };

        cloudinary.uploader.upload(
            file.path,
            onResponse,
            {
                public_id: id
            }
        );
    };

    const remove = (url, next) => {

        const onResponse = (result) => {

            if (result.error) {
                return next(new Error(result.error));
            }

            next(null, url);
        };

        const id = last(url.split('/')).replace(/\..*$/, '');

        cloudinary.api.delete_resources([id], onResponse);
    };

    return {

        create,

        remove

    };
};
