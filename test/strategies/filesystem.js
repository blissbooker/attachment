'use strict';

/*global describe, it, beforeEach, after */

const expect = require('chai').expect;
const fs = require('fs');
const async = require('async');
const rimraf = require('rimraf');
const path = require('path');

describe('filesystem strategy', () => {

    const fixtures = path.join(__dirname, '..', 'fixtures');
    const images = path.join(fixtures, 'images');
    const tmp = path.join(fixtures, '.tmp');

    const mammothFixture = fs.realpathSync(images + '/mammoth.jpg');
    const mammothSource = mammothFixture + '-tmp.jpg';

    const spongebobFixture = fs.realpathSync(images + '/spongebob.png');
    const spongebobSource = spongebobFixture + '-tmp.png';

    const mammoth = {
        path: mammothSource,
        contentType: 'image/jpeg'
    };

    const spongebob = {
        path: spongebobSource,
        contentType: 'image/png'
    };

    const attachment = require('../..')({
        strategy: 'filesystem',
        config: {
            path: tmp,
            url: ''
        }
    });

    beforeEach(() => {
        fs.createReadStream(mammothFixture).pipe(fs.createWriteStream(mammothSource));
    });

    after((done) => {
        rimraf(tmp, done);
    });

    it('moves the image to target path', (done) => {
        attachment.create(mammoth, (err, url) => {
            expect(fs.existsSync(tmp + url)).to.be.true;
            done();
        });
    });

    describe('remove', () => {

        it('deletes the assigned image', (done) => {
            async.waterfall([
                (callback) => {
                    attachment.create(mammoth, (err, url) => {
                        expect(fs.existsSync(tmp + url)).to.be.true;
                        callback(err, url);
                    });
                },
                (url, callback) => {
                    attachment.remove(url, (err) => {
                        expect(fs.existsSync(tmp + url)).to.be.false;
                        callback(err);
                    });
                }
            ], done);
        });

        it('leaves existing images untouched', (done) => {

            async.series({

                spongebob: (callback) => {
                    fs.createReadStream(spongebobFixture).pipe(fs.createWriteStream(spongebobSource));
                    attachment.create(spongebob, (err, url) => {
                        expect(fs.existsSync(tmp + url)).to.be.true;
                        callback(err, url);
                    });
                },

                mammoth: (callback) => {
                    attachment.create(mammoth, (err, url) => {
                        expect(fs.existsSync(tmp + url)).to.be.true;
                        callback(err, url);
                    });
                }

            }, (err, results) => {

                attachment.remove(results.mammoth, (err) => {
                    expect(fs.existsSync(tmp + results.mammoth)).to.be.false;
                    expect(fs.existsSync(tmp + results.spongebob)).to.be.true;
                    done(err);
                });

            });
        });
    });

});
