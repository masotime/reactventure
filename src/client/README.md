All client-side specific code lives here.

# auth.js

Authentication is an example of a module that must have different implementations client and server side. Client side, an secure network call must be made to authenticate, whereas server side a "native" call is sufficient.

One additional issue here is that authentication needs to work within the redux framework. In order to achieve this, we'll make use of redux middleware to decorate actions with a "command" function that depends on whether the code is executing client or server side.
