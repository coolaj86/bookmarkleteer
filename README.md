bookmarkleteer
==============

Source for <http://bookmarkleteer.com>

A web app that creates bookmarklets from JavaScript snippets.

Install
===

    git clone https://github.com/coolaj86/bookmarkleteer
    pushd bookmarkleteer/
      npm install
      npm install -g locomotive
      pushd browser/
        npm install
        npm install -g grunt-cli
        grunt build
      popd
      lcm server -p 5050

Visit <http://localhost:5050>


API
===

### GET /scripts

return a list of the 10 most recent scripts

### POST /scripts

Create a new script

### PUT /scripts/:id

Update a script

### GET /scripts/:id

Get a script (the whole object)

### GET /scripts/:id.js

Get just the minified text

### GET /scripts/:id.gif

Get just bump the counter

### OPTIONS /scripts/:id.txt && GET /scripts/:id.txt

Serve script with text mime type as CORS resource 

### Example Object

```javascript
{
  "id": Number // must be converted to base 36
, "name": String
, "description": String
, "raw": String
, "minified": String
  // if owned, the owner must be logged in to edit
, "owner": String
  // if secret, the edit must have the secret supplied
, "secret": String
, "created": Date
, "modified": Date
}
```

TODO
===

* Remove hard-coded references to bookmarkleteer.com
* Change view when url changes
* Show which bookmarklets are most popular.
* Track which referrers are most popular.
* Allow user to edit via secret
* Show UI for choosing inlined vs fetched bookmarklet
* Add social shares
* Advanced options
  * don't minify
  * prefer inline vs fetch
  * no tracking gif
* Let description be in markdown
* Allow user to flag a script as bad
* Allow XHR2 / CORS loading of script as text
* Support drag 'n' drop file upload
* Support [iFrame + window.postMessage hack](http://blog.coolaj86.com/articles/how-to-get-around-latest-browser-security-measures/)

Apendix
===

### MongoDB

To have launchd start mongodb at login:

    ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents

Then to load mongodb now:

    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist

Or, if you don't want/need launchctl, you can just run:

    mongod
