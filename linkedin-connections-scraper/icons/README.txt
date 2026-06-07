Place square PNG icons here with these exact filenames:

  icon16.png   (16x16)
  icon32.png   (32x32)
  icon48.png   (48x48)
  icon128.png  (128x128)

The extension will load without them but Chrome will log a warning and
use a default placeholder in the toolbar. Any flat blue/LinkedIn-ish PNG
works — feel free to grab a free icon set or generate one.

Quick way to make placeholders with ImageMagick:

  convert -size 128x128 xc:#0a66c2 -fill white -gravity center \
          -pointsize 72 -annotate +0+0 "Li" icon128.png
  convert icon128.png -resize 48x48  icon48.png
  convert icon128.png -resize 32x32  icon32.png
  convert icon128.png -resize 16x16  icon16.png
