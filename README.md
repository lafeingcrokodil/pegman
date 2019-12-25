Pegman
======

## Teleporter

The teleporter page is for teleporting Pegman to all corners of the world.

## Locator

The locator page is for helping Pegman figure out where he was teleported to.

## Server

To start the server:

1. Make sure that you're using the Node.js and NPM versions specified in `package.json`.
1. Install dependencies using `npm install` if you haven't already done so.
1. Run `npm start`.

You can control how much is logged via the `DEBUG` environment variable. For example, to log everything:

    DEBUG=* npm start

If you don't want to use the default port 3000, you can specify a different one using the `PORT` environment variable. For example:

    PORT=3333 DEBUG=pegman:* npm start
