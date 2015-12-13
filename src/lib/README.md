# `lib` folder

"Lib" will represent everything that lives server-side. No universal or client-side code should live here.

## `db.js` Schema (subject to change)

* .users[] - id, email, firstname, lastname, username
* .messages[] - id, from{id}, to{id}, message
* .medias[] - id, type, data
* .posts[] - id, user{id}, medias[] (see above)

### Data dictionary

* .medias[].type - paragraph | video | image
* .medias[].data - <url> | <text>
