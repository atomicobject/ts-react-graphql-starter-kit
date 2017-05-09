#!/bin/sh
chown -R node: /usr/src/app
supervisord -c /usr/src/app/docker/supervisord.conf
