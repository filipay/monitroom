# monitroom
[![Build Status](https://travis-ci.org/filipay/monitroom.svg?branch=master)](https://travis-ci.org/filipay/monitroom)
[![Coverage Status](https://coveralls.io/repos/github/filipay/monitroom/badge.svg?branch=master)](https://coveralls.io/github/filipay/monitroom?branch=master)
##Info

This is a [Node.js](https://nodejs.org/) project.

Small project to monitor who's in the house. Also small metrcis like CPU usage and network speeds.

## Libraries

* [Express.js](https://expressjs.com/)
* [NeDB](https://github.com/louischatriot/nedb) for DB
* [Winston.js](https://github.com/winstonjs/winston) for logging
* [arpscan](https://github.com/goliatone/arpscan)

## Setup
Make sure you have `arp-scan` installed on your machine.

* For Ubuntu: `sudo apt-get install arp-scan`
* For OS X: `brew install arp-scan` (P.S this requires you to have [Homebrew](http://brew.sh/) installed)
* AFAIK nothing for Windows compatible with `arpscan` library


#### Make sure you install the LATEST version of Node.js (*6.x*) via [package manager](https://nodejs.org/en/download/package-manager/). 

Older versions appear to give unexpected errors due to the arpscan lib. 

Get dependencies by running `npm install` in the cloned folder.
To run `./start.sh`. Make sure you have permissions to run.

Currently the development branch is '**testing**'. So be sure `git checkout testing` before starting! 
