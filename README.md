# WhalesongJS
A node version of [Whalesong](https://github.com/alfred82santa/whalesong), using Google
Puppeteer.

### Requirements

    node (>=9.9.0)
    npm (>=5.6.0)

The lib was not tested with previous versions.

##### Development requirements

    make

### Installation
The lib is using the [Puppeteer](https://github.com/GoogleChrome/puppeteer) that will 
install a Chromium for the browser backend.

    $ npm install whalesong-js


### Features

* Non blocking driver. It can do more than one thing at same time.
* Monitor feature. Javascript events in browser will be sent to Whalesong.
* Easy way to build new features.
* AmpersandJS/BackboneJS models and collection monitor.
* AmpersandJS/BackboneJS field monitor.
* Take screenshots (page and css elements).
* Chromium backend.

### TODO
* Tests
* Documentation
* Examples
* Enable JS async iterator

### Development
To help in development:

##### Install library requirements:

    make requirements

##### Build scriptlet and lib

    make build

Any other doubts, check in the original 
[Whalesong](https://github.com/alfred82santa/whalesong) repository.
