# What's attachment?

Attachments is a generic attachments plugin for node. 
It handles attachment creation and deletion using one of the following storage strategies:
- Cloudinary
- Filesystem

[![Build Status](https://travis-ci.org/blissbooker/attachment.svg?branch=master)](https://travis-ci.org/blissbooker/attachment)
[![Dependency Status](https://gemnasium.com/blissbooker/attachment.svg)](https://gemnasium.com/blissbooker/attachment)
[![Code Climate](https://codeclimate.com/github/blissbooker/attachment/badges/gpa.svg)](https://codeclimate.com/github/blissbooker/attachment)

## Configuration

### Filesystem Storage

```javascript
const options = {
    strategy: 'filesystem',
    attribute: 'image',
    config: {
        path: '/tmp/system',
        url: '/system'
    }
};
```

### Cloudinary Storage

```javascript
const options = {
    strategy: 'cloudinary',
    config: {
        cloud_name: 'test',
        api_key: '123',
        api_secret: '123',
        secure: true
    }
};
```

```javascript
const attachment = require('attachment')(options);
```

## Usage


### Create

```javascript
const file = {
    path: 'path/to/foobar.png'
    contentType: 'image/png'
};

attachment.create(file, (err, url) {
    console.log(url);
});
```

```javascript
"/system/548831d1e61bb2464310e803.png"
```

### Remove

```javascript
attachment.remove("/system/548831d1e61bb2464310e803.png", (err, url) {
    console.log(url);
});
```
