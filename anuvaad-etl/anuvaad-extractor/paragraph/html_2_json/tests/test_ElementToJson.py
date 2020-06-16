# -*- coding: UTF-8 -*- #

from html2json import Element


def test_tag():
    dut = Element(u'p')

    expect = {
        u'tag': u'p'
    }

    assert dut.render() == expect


def test_text():
    dut = Element(u'p', u'some text')

    expect = {
        u'tag': u'p',
        u'text': u'some text'
    }

    assert dut.render() == expect


def test_attr():
    dut = Element(u'p', u'some text', {u'class': u'some class'})

    expect = {
        u'tag': u'p',
        u'text': u'some text',
        u'attr': {
            u'class': u'some class'
        }
    }

    assert dut.render() == expect


def test_compound():
    dut = Element(u'ul', u'some text', {u'class': u'some class'})
    dut.child.append(Element(u'li', u'some text', {u'class': u'some class'}))

    expect = {
        u'tag': u'ul',
        u'text': u'some text',
        u'attr': {
            u'class': u'some class'
        },
        u'child': [
            {
                u'tag': u'li',
                u'text': u'some text',
                u'attr': {
                    u'class': u'some class'
                }
            }
        ]
    }

    assert dut.render() == expect


def test_compound2():
    dut = Element(u'ul', u'some text', {u'class': u'some class'})
    dut.child.append(Element(u'li', u'some text', {u'class': u'some class'}))
    dut.child.append(Element(u'li', u'some text', {u'class': u'some class'}))

    expect = {
        u'tag': u'ul',
        u'text': u'some text',
        u'attr': {
            u'class': u'some class'
        },
        u'child': [
            {
                u'tag': u'li',
                u'text': u'some text',
                u'attr': {
                    u'class': u'some class'
                }
            }, {
                u'tag': u'li',
                u'text': u'some text',
                u'attr': {
                    u'class': u'some class'
                }
            }
        ]
    }

    assert dut.render() == expect
