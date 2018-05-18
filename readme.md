> A neat automation program to fetch icomoon fonts and place them in your project.

## Why?
It is very annoying to manually download, extract, and replace the files on every icon change

## How?
The program will run automation that login to icomoon, download your icomoon library, extract the library and place it in your project directory

## Getting started
Install with npm:

    npm install icomoon-fetcher --save

## Getting started

Add these environment variables, you can add with the .env file:

```
# Your icomoon username
ICOMOON_USER=user@icomoon.com

# Your icomoon password 
ICOMOON_PASS=passw*rd

# Your icomoon library name
FONT_NAME=space-icons

# Icomoon icons file target
ICONS_FILE_PATH=/Project/scss/icons.scss

# Icomoon fonts dir target
ICONS_FONTS_DIR=/Project/assets/fonts

# (Optional) Path to replace the icons.scss fonts path
OVERWRITE_FONTS_PATH='../fonts'
```