'use strict';

const uuid = require('node-uuid');

module.exports = (options) => {

    const path = `./strategies/${options.strategy || 'filesystem'}`;
    const strategy = require(path)(options.config);

    return {

        create(file, fn) {
            strategy.create(uuid.v4(), file, fn);
        },

        remove(url, fn) {
            strategy.remove(url, fn);
        }

    };

};

