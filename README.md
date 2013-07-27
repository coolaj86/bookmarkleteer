bookmarkleteer
==============

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
