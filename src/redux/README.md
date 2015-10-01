Redux is so specialized it behooves me to put it in a separate folder.

# Schema (subject to change)

* .users[] - id, email, firstname, lastname, username
* .messages[] - id, from{id}, to{id}, message
* .medias[] - id, type, data
* .posts[] - id, user{id}, medias[] (see above)

## Data dictionary

* .medias[].type - paragraph | video | image
* .medias[].data - <url> | <text>
