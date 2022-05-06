#!/bin/bash
env | grep NODE_HOSTNAME > /app/.env
node server.js