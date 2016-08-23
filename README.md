# monitroom

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
* For Mac: `brew install arp-scan`
* AFAIK nothing for Windows compatible with `arpscan` library

Install [Node.js via package manager](https://nodejs.org/en/download/package-manager/) or otherwise.

Get dependencacies via `npm install`.

To run `./start.sh`. Make sure you have permissions to run.
