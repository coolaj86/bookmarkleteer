bookmarkleteer
==============

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
      lcm server 5050

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

### GET /scripts/:id/name.min.js

Get just the minified text

### Example Object

```javascript
{
  "name": String
, "description": String
, "_raw": String
, "_minified": String
, "_uriencoded": String
, "_loader": String
, "id": Number
  // if owned, the owner must be logged in to edit
, "owner": String
  // if secret, the edit must have the secret supplied
, "secret": String
, "created": Date
, "modified": Date
}
```


Goals
===

Source for bookmarkleteer.com

A web site where you paste a snippet of javascript and it creates a bookmarklet for you that you can share.

For example http://bookmarkleteer.com/#jQuerify would take you to a page where there's a bookmarklet that loads jquery.

Maybe 
http://api.bookmarkleteer.com/v1/bm/jquerify
or
http://api.bookmarkleteer.com/v1/bm/abcd01234/jquerify

Might return something like

     { id: "ef842ax" , name: "jQuerify" , script: "" , }

It would be convenient to be able to get the original script, maybe
http://raw.bookmarkleteer.com/v1/bm/abcd01234/jquerify.js
and the minified
http://raw.bookmarkleteer.com/v1/bm/abcd01234/jquerify.min.js
and the url encoded
http://raw.bookmarkleteer.com/v1/bm/abcd01234/jquerify.urlencoded.js

It could be CORS enabled so that you can AJAX load the script from anywhere.

There could be a checkbox for "include entire script" in the bookmarklet, but by default, load it dynamically from bookmarkleteer.com
Also allow external links and gists.

Considerations:

Sites like Facebook, Twitter, etc are using the new "HTML5" Security Policy headers
that disallow dynamically loaded bookmarklets (and maybe bookmarklets altogether).

You can get around some of the remote script restrictions by loading the script as text
and putting it into a script tag via the bookmarklet rather than a script with an src.

MongoDB
===

To have launchd start mongodb at login:

    ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents

Then to load mongodb now:

    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist

Or, if you don't want/need launchctl, you can just run:

    mongod
