# reactventure

Trying to figure out the holy grail for [universal apps][1].

# Status

Managed to figure out how to `renderToString` via react-router. The essence of it is [covered here][2], but I've [adapted it to my needs][3].

* Introduced barebones express rendering.
* Introduced 2 entry points
  * index.js with an argument for the route will render to console.
  * serve.js does your bog-standard express app. Very basic.

[1]: https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb
[2]: https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
[3]: src/server/render.js