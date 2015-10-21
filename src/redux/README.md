Everything here is _universal_.

Redux is so specialized it behooves me to put it in a separate folder.

# Overview

Actions for reducers should not be involved in data fetching or other I/O bound operations. they should be purely computational.

Essentially what this means is that actions that involve CRUD should assume that persistence has already been taken care of, and the necessary payload exists solely to compute the new state.

Middleware is what must be used to do the actual I/O bound operations, which are typically, _preferably_ asynchronous. The redux documentation does not clearly explain (or is perhaps blissfully unaware) that the function of middleware goes beyond the application of asynchronous support but in the ability to decorate a store with its reducers as two distinct parts - client and server side. i.e. Client-based I/O (network RESTful APIs) alongside server-based I/O (disk / database access) can be defined separately, while maintaining the consistency of reducing logic.

# Schema (subject to change)

* .users[] - id, email, firstname, lastname, username
* .messages[] - id, from{id}, to{id}, message
* .medias[] - id, type, data
* .posts[] - id, user{id}, medias[] (see above)

## Data dictionary

* .medias[].type - paragraph | video | image
* .medias[].data - <url> | <text>
