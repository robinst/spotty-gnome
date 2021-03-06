**NOTE:** Nowadays, there's the excellent Flatpak project. I recommend using the Spotify client from there instead, see here: https://flathub.org/apps.html

---

Spotty Gnome
============

Spotty is a GNOME app wrapping the [Spotify][spotify] web player to
provide media key support (play/pause, next and previous).

WebKitGTK+ 2 is required, which should be available in a recent GNOME
release (3.8).

![Screenshot](img/screenshot.jpg)

Installing
----------

Clone this repository and then run `install.sh`. It will just create a .desktop
file in the appropriate location so that it has an icon and can be added to
favorites/menus.

Fedora should work out of the box.

On Ubuntu the `gir1.2-webkit2-3.0` package must be installed (see GNOME 3 PPA).

Contributing
------------

Contributions welcome! Because it's written in JS, the edit/run cycle is
very fast.

Some things to do:

* Stability
* Application menu (e.g. for navigating back to web player)
* Remember window position and size

License
-------

Copyright (c) 2013 Robin Stocker.

Distributed under the MIT License, see LICENSE.txt for details.


[spotify]: https://www.spotify.com/
