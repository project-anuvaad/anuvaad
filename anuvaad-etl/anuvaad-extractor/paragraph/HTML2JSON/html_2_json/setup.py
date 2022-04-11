# -*- coding: UTF-8 -*-

from setuptools import setup


setup(name='garyhurtz_html2json',
      version='0.0.2',
      description='Tools for building HTML and parsing HTML into JSON in Python, and rendering HTML from JSON using Jinja.',
      url='https://github.com/garyhurtz/html2json.py.git',
      author='Gary Hurtz',
      author_email='garyhurtz@gmail.com',
      license='None',
      packages=['html2json'],
      install_requires=['Jinja2', 'beautifulsoup4'],
      zip_safe=False
      )

