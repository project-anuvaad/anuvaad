# -*- coding: UTF-8 -*- #
import pprint
from bs4 import BeautifulSoup


class Element(object):
    """
    Represents a single, nestable HTML element.

    Built for compatibility with html2json.js
    """

    def __init__(self, tag, text=u'', attr={}):
        self.tag = tag.strip()
        self.text = text.strip()
        self.attr = attr
        self.child = []

    def __str__(self):
        return pprint.pformat(self.render())

    def render(self):
        """
        Render the element to json

        Eliminate any empty members to minimize filesize

        :return: dict representation of the element
        """
        # define possible pairs
        pairs = [
            (u'tag', self.tag),
            (u'text', self.text),
            (u'attr', self.attr),
            (u'child', [c.render() for c in self.child])
        ]

        # return only those that contain a value
        return dict(pair for pair in pairs if pair[1])

    def append(self, el):
        self.child.append(el)

    @classmethod
    def parse(cls, html, parent=u'html'):
        """
        Parse the body of html string.

        If the html string has a single root node, parse it and return it.

        If not, create an Element of type *parent* (default div) and parse html into children of that Element.

        :param html: HTML string
        :param parent: the parent type, if needed
        :return: Element
        """

        soup = BeautifulSoup(html, 'html.parser')

        # if html has a single parent, parse it and return it
        if len(soup.html) == 1:
            return cls._parse_to_element(soup.html.body.next)

        # html does not have a single parent
        # create a root element, then parse the input into children of the root
        root = Element(parent)
        
        for el in soup.html:

            if el.name is not None:
                root.child.append(cls._parse_to_element(el))

        return root

    @classmethod
    def _parse_to_element(cls, soup):
        """
        Parse soup into a (possibly nested) Element

        :param soup:
        :return: Element
        """

        # if an element has one child and it is a string, it is held in soup.string
        # else soup.string is None
        children = list(soup.children)

        if len(children) == 1 and not children[0].name:
            return Element(soup.name, soup.string, soup.attrs)

        # if the child is a tag it will have a name attribute, else it is a string

        # first handle strings, and recover any inline spans
        # the input generally contains newlines and whitespace so clean it up
        # if so, render all children into a single string
        if any(c.string.strip() for c in soup.children if not c.name):
            return Element(soup.name, u''.join(str(c) for c in soup.children), soup.attrs)

        # now handle remaining elements
        # instantiate a parent then recurse to instantiate each child
        el = Element(soup.name, u'', soup.attrs)

        for child in (c for c in soup.children if c.name):
            el.child.append(cls._parse_to_element(child))

        return el
