> A neat automation program to fetch icomoon fonts and place them in your project.

## Why?
It is very annoying to manually download, extract, and replace the files on every icon change

## How?
The program will run automation that login to icomoon, download your icomoon library, extract the library and place it in your project directory

## Getting started
Install with npm:

    npm install icomoon-fetcher --save

## Getting started

Add these environment variables:

ICOMOON_USER=user@icomoono.com              - Your icomoon username
ICOMOON_PASS=passw*rd                       - Your icomoon password
ICONS_FILE_PATH=/Project/scss/icons.scss    - Icomoon icons file target
ICONS_FONTS_DIR=/Project/assets/fonts       - Icomoon fonts dir target
FONT_NAME=space-icons                       - Your icomoon library name
OVERWRITE_FONTS_PATH='../fonts'             - (Optional) Path to replace the icons.scss fonts path