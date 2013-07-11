#!/bin/sh

dir_relative=`dirname $0`
dir=`cd $dir_relative; pwd`
data_dir="$XDG_DATA_HOME"
if [ -z "$target" ]; then
  data_dir="$HOME/.local/share"
fi

target="$data_dir/applications/spotty-gnome.desktop"

sed "s|INSTALL_DIR|$dir|g" "$dir/spotty-gnome.desktop" > "$target"

echo Installed desktop file to: $target
echo Note that it references files in this directory, so don\'t move these: $dir
