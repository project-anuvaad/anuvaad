# html2json.py

Tools for building HTML and parsing HTML into JSON in Python, and rendering HTML from JSON using [Jinja](https://github.com/pallets/jinja).

The JSON data structure follows that used in [html2json.js and json2html.js](https://github.com/Jxck/html2json), so that the resulting JSON can (for example) be constructed and/or stored on a Python server, passed to the browser via an AJAX call, then rendered using javascript.

The json2html.html Jinja macro is also compatible with [nunjucks](https://mozilla.github.io/nunjucks/), so both server-side and client-side templating are supported. Client-side rendering can also be performed in pure javascript using [json2html.js](https://github.com/Jxck/html2json)).

The code is pretty straight-forward, and can be easily modified to support alternative JSON data structures from other libraries.

Take a look at [the documentation](https://github.com/garyhurtz/html2json.py/wiki) for more information.
