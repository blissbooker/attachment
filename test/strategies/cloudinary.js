'use strict';

/*global describe, it, before, after, afterEach */

const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const path = require('path');
const _ = require('lodash');

describe('Cloudinary Strategy', () => {

    const cloudinary = {

        config: _.noop,

        url: _.constant('image.jpg'),

        uploader: {
            upload: _.noop
        },

        api: {
            //jshint camelcase:false
            delete_resources: _.noop
        }

    };

    const fixtures = path.join(__dirname, '..', 'fixtures');
    const images = path.join(fixtures, 'images');

    const mammothSource = fs.realpathSync(images + '/mammoth.jpg');

    const mammoth = {
        path: mammothSource,
        contentType: 'image/jpeg'
    };

    const attachment = require('../..')({
        strategy: 'cloudinary',
        config: {
            //jshint camelcase:false
            cloud_name: 'test',
            api_key: '123',
            api_secret: '123',
            secure: true,
            cloudinary
        }
    });

    describe('create', () => {

        afterEach(() => {
            cloudinary.uploader.upload.restore();
        });

        describe('success', () => {

            before(() => {
                sinon.stub(cloudinary.uploader, 'upload').yields({});
            });

            it('uploads the image to cloudinary', (done) => {
                attachment.create(mammoth, (err, url) => {
                    expect(url).to.not.be.empty();
                    expect(cloudinary.uploader.upload).to.have.been.calledWith(mammoth.path, sinon.match.typeOf('function'));
                    done(err);
                });
            });

        });

        describe('failure', () => {

            before(() => {
                sinon.stub(cloudinary.uploader, 'upload').yields({
                    error: 'The world is coming to an end!'
                });
            });

            it('exposes api errors', (done) => {
                attachment.create(mammoth, (err) => {
                    expect(err).to.be.an.instanceof(Error);
                    expect(err.message).to.equal('The world is coming to an end!');
                    done();
                });
            });

        });

    });


    describe('url', () => {

        before(() => {
            sinon.stub(cloudinary.uploader, 'upload').yields({});
            sinon.stub(cloudinary, 'url').returns();
        });

        after(() => {
            cloudinary.uploader.upload.restore();
            cloudinary.url.restore();
        });

        it('assigns the url', (done) => {

            attachment.create(mammoth, (err) => {
                expect(cloudinary.url).to.have.been.calledWith(
                    sinon.match(/^[a-zA-Z0-9-]{36}$/),
                    {
                        format: 'jpeg',
                        secure: true,
                        cdn_subdomain: true,
                        secure_cdn_subdomain: true
                    }
                );
                done(err);
            });

        });
    });

    describe('remove', () => {

        afterEach(() => {
            cloudinary.api.delete_resources.restore();
        });

        describe('success', () => {

            before(() => {
                sinon.stub(cloudinary.api, 'delete_resources').yields({});
            });

            it('deletes the assigned image', (done) => {

                const url = 'path/image-id.png';

                attachment.remove(url, (err) => {
                    expect(err).to.be.null;
                    expect(cloudinary.api.delete_resources).to.have.been.calledWithExactly(['image-id'], sinon.match.typeOf('function'));
                    done();
                });
            });
        });

        describe('failure', () => {

            before(() => {
                sinon.stub(cloudinary.api, 'delete_resources').yields({
                    error: 'You should not delete any content!'
                });
            });

            it('exposes api errors', (done) => {

                const url = 'path/image-id.png';

                attachment.remove(url, (err) => {
                    expect(err).to.be.an.instanceof(Error);
                    expect(err.message).to.equal('You should not delete any content!');
                    done();
                });
            });
        });

    });

});
