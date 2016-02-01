# attachment

[![Build Status](https://travis-ci.org/blissbooker/attachment.svg?branch=master)](https://travis-ci.org/blissbooker/attachment)
[![Dependency Status](https://gemnasium.com/blissbooker/attachment.svg)](https://gemnasium.com/blissbooker/attachment)
[![Code Climate](https://codeclimate.com/github/blissbooker/attachment/badges/gpa.svg)](https://codeclimate.com/github/blissbooker/attachment)

## Configuration

### Filesystem Storage

```javascript
const config = {
    {
        strategy: 'filesystem',
        attribute: 'image',
        config: {
            path: '/tmp/system',
            url: '/system'
        }
    }
};

const attachment = require('attachment')(config);
```

## Usage

```javascript
const params = {
  file: {
  	  path: 'path/to/foobar.png'
      contentType: 'image/png'
  }
};

attachment.create(params, (err, url) {
    console.log(url);
});
```

```javascript
"/system/548831d1e61bb2464310e803.png"
```
