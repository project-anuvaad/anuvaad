#!/bin/bash
env | grep NODE_HOSTNAME > /app/.env
NODE_HOSTNAME=$NODE_HOSTNAME node server.js