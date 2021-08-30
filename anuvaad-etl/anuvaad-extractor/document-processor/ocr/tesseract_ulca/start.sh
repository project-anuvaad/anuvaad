#!/bin/bash
#python app.py
gunicorn -w 2 -b :5000 -t 200 wsgi:app