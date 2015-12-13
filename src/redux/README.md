Everything here is _universal_.

# Overview

Actions for reducers should not be involved in data fetching or other I/O bound operations. they should be purely computational.

Essentially what this means is that actions that involve CRUD should assume that persistence has already been taken care of, and the necessary payload exists solely to compute the new state.
