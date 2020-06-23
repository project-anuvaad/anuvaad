# -*- coding: UTF-8 -*- #
import pytest
from html2json import Element
from jinja2 import Environment, FileSystemLoader


@pytest.fixture()
def env():
    templates_path = 'templates'
    return Environment(loader=FileSystemLoader(templates_path))


@pytest.fixture()
def dut(env):
    return Element('ul', 'text', {'class': 'some class'})


def test_simple_list(env, dut):

    dut.child.append(Element(u'li', u'text', {u'class': u'some class'}))
    dut.child.append(Element(u'li', u'text', {u'class': u'some class'}))

    result = env.get_template(u'json2html.html').render(root=dut.render())

    expect = u'<ul class="some class">text<li class="some class">text</li><li class="some class">text</li></ul>'

    assert result == expect


def test_property(env, dut):

    dut.child.append(Element(u'li', u'text', {u'disable': None}))
    dut.child.append(Element(u'li', u'text', {u'disable': u''}))

    result = env.get_template(u'json2html.html').render(root=dut.render())

    expect = u'<ul class="some class">text<li disable>text</li><li disable>text</li></ul>'

    assert result == expect
