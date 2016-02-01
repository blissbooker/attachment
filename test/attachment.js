'use strict';

/*global describe, it, before */

var expect = require('chai').expect;
const attachment = require('../');

describe('attachment', () => {

    let subject;

    before(() => {
        subject = attachment({
            strategy: 'filesystem',
            config: {
                path: __dirname + '/.tmp',
                url: '/system'
            }
        });
    });

    it('provides a create method', (done) => {

        expect(subject).to.respondTo('create');
        done();
    });

    it('provides a remove method', (done) => {

        expect(subject).to.respondTo('remove');
        done();
    });

});
