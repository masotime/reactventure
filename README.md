# reactventure

Trying to figure out the holy grail for [universal apps][1].

# Status

Managed to figure out how to `renderToString` via react-router. The essence of it is [covered here][2], but I've [adapted it to my needs][3].

* Introduced barebones express rendering.
* Introduced 2 entry points
  * index.js with an argument for the route will render to console.
  * serve.js does your bog-standard express app. Very basic.

# react@0.14 and react-router@1.0.0-rc2

Changes are mostly involved with the introduction of `ReactDOM`. No more of the factory nonsense for `<Provider>`. react-router@1.0.0-rc2 required the manual addition of 2 dependencies: `deep-equal` and `qs`. This may change in future revisions - it does _not_ seem like a `peerDependencies` issue.

* I gave up on rendering directly to `document.body` - I now have an outer div `#react-container`. This may change in the future.
* `createLocation` is no longer needed on the server-side rendering code in `react-router@1.0.0-rc2`

# Annoying eslint issues

For JSX to be linted correctly, you need to install `eslint-plugin-react` _globally_. It's listed as a devDependency, but the sublime plugin needs a global copy.

# React hot loading

Uses the fancy new [react-transform-hmr][rhl1], but instead of the shitty use of `.babelrc`, we look at [this issue][rhl2] while taking care of the [new format][rhl3].


[1]: https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb
[2]: https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
[3]: src/server/render.js

[rhl1]: https://github.com/gaearon/react-transform-hmr
[rhl2]: https://github.com/gaearon/react-transform-hmr/issues/5
[rhl3]: https://github.com/gaearon/babel-plugin-react-transform