#!/bin/sh
cp -a dist/. lightsoff/
scp -r ./lightsoff root@sitebuilt.net:/home/iot/public_html/v3
scp  ./mqttws31.js root@sitebuilt.net:/home/iot/public_html/v3
scp  ./utility.js root@sitebuilt.net:/home/iot/public_html/v3
