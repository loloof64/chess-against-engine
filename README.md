# Chess against engine

Play chess against your device

## Users with a Nvidia graphic cards

### DEB/RPM

If after installing the deb/rpm archive you can't see the window content,
use the flag `WEBKIT_DISABLE_DMABUF_RENDERER=1` when running the application.

### AppImage

The same goes for the AppImage format, but you can even do better this time :

1. Install [AppImage launcher](https://github.com/TheAssassin/AppImageLauncher). (You can access the release page of the project and download archive file.)
2. Double clic on your appimage file : and choose integrate on the popup.
3. Find your .desktop file (typically in ~/.local/share/applications)
4. Set environement variable `WEBKIT_DISABLE_DMABUF_RENDERER=1` to be "associated" with the execution
   1. locate line starting with `Exec=`
   2. append environement variable : `Exec=env WEBKIT_DISABLE_DMABUF_RENDERER=1 /path/to/executable`, where `/path/to/executable` is the path of the executable, and should be left as is.

## Credits

### Fonts

Font Free Serif downloaded from https://fonts2u.com/download/free-serif.font.

### Icons

Some icons have been downloaded from [SVGRepo](https://www.svgrepo.com) :

- start.svg : https://www.svgrepo.com/svg/422652/chess-game-sport
- stop.svg : https://www.svgrepo.com/svg/501832/stop
- reverse.svg : https://www.svgrepo.com/svg/414907/arrows-vertical-direction
- first.svg : https://www.svgrepo.com/svg/535151/arrow-left-to-line
- last.svg : https://www.svgrepo.com/svg/535158/arrow-right-to-line
- back.svg : https://www.svgrepo.com/svg/535155/arrow-left
- next.svg : https://www.svgrepo.com/svg/535153/arrow-right

### Vectors

Using some vectors from [WikiMedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces)
