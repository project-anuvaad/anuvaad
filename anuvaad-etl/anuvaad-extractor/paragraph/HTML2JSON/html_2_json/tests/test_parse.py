# -*- coding: UTF-8 -*- #
from html2json import Element
import os


def test_cover():

    cwd = os.path.dirname(os.path.realpath(__file__))

    with open(os.path.join(cwd, u'cover.html'), u'r') as infile:
        html = infile.read()

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.child[0].tag == u'h1'
    assert dut.child[0].text == u'title'
    assert dut.child[1].tag == u'p'
    assert dut.child[1].text == u'content'
    assert dut.child[2].tag == u'figure'
    assert dut.child[2].child[0].tag == u'img'
    assert dut.child[2].child[0].attr[u'src'] == u'cover.jpg'

    json = {
        u'tag': u'div',
        u'child': [
            {
                u'tag': u'h1',
                u'text': u'title',
            },
            {
                u'tag': u'p',
                u'text': u'content',
            },
            {
                u'tag': u'figure',
                u'child': [
                    {
                        u'tag': u'img',
                        u'attr': {
                            u'src': u'cover.jpg'
                        }
                    }
                ]
            }
        ]
    }

    assert dut.render() == json


def test_div_tag():
    html = u'<div></div>'
    json = {u'tag': u'div'}

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.render() == json


def test_div_with_text():
    html = u'<div>this is a div</div>'
    json = {
        u'tag': u'div',
        u'text': u'this is a div'
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.text == u'this is a div'

    assert dut.render() == json


def test_text_gets_stripped():
    html = u'<div>this is a div   </div>'
    json = {
        u'tag': u'div',
        u'text': u'this is a div'
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.text == u'this is a div'

    assert dut.render() == json


def test_div_with_id():
    html = u'<div id="foo"></div>'
    json = {
        u'tag': u'div',
        u'attr': {u'id': u'foo'}}

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.attr[u'id'] == u'foo'

    assert dut.render() == json


def test_div_with_id_and_class():
    html = u'<div id="foo" class="bar goo"></div>'
    json = {
        u'tag': u'div',
        u'attr': {
            u'id': u'foo',
            u'class': [u'bar', u'goo']
        }
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.attr[u'id'] == u'foo'
    assert dut.attr[u'class'] == [u'bar', u'goo']

    assert dut.render() == json


def test_div_with_id_and_class_and_text():
    html = u'<div id="foo" class="bar goo">this is a div</div>'
    json = {
        u'tag': u'div',
        u'attr': {
            u'id': u'foo',
            u'class': [u'bar', u'goo']
        },
        u'text': u'this is a div'
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.text == u'this is a div'
    assert dut.attr[u'id'] == u'foo'
    assert dut.attr[u'class'] == [u'bar', u'goo']

    assert dut.render() == json


def test_div_with_h1_child_and_text():
    html = u'<div><h1>text</h1></div>'
    json = {
        u'tag': u'div',
        u'child': [{
            u'tag': u'h1',
            'text': 'text'
        }]
    }

    dut = Element.parse(html)

    print(dut)

    assert dut.tag == u'div'
    assert dut.child[0].tag == u'h1'
    assert dut.child[0].text == 'text'

    assert dut.render() == json


def test_div_with_child():
    html = u'<div><p></p></div>'
    json = {
        u'tag': u'div',
        u'child': [{
            u'tag': u'p'
        }]
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.child[0].tag == u'p'

    assert dut.render() == json


def test_ul():
    html = u'<ul><li></li><li></li></ul>'
    json = {
        u'tag': u'ul',
        u'child': [
            {
                u'tag': u'li'
            }, {
                u'tag': u'li'
            }
        ]
    }

    dut = Element.parse(html)

    assert dut.tag == u'ul'
    assert dut.child[0].tag == u'li'
    assert dut.child[1].tag == u'li'

    assert dut.render() == json


def test_figure():
    html = u'<figure><img src="abc"></figure>'
    json = {
        u'tag': u'figure',
        u'child': [
            {
                u'tag': u'img',
                u'attr': {
                    u'src': u'abc'
                }
            }
        ]
    }

    dut = Element.parse(html)

    assert dut.tag == u'figure'
    assert dut.child[0].tag == u'img'

    assert dut.render() == json


def test_figure_with_newlines():
    html = u'<figure>\n<img src="abc">\n</figure>'
    json = {
        u'tag': u'figure',
        u'child': [
            {
                u'tag': u'img',
                u'attr': {
                    u'src': u'abc'
                }
            }
        ]
    }

    dut = Element.parse(html)

    assert dut.tag == u'figure'
    assert dut.child[0].tag == u'img'

    assert dut.render() == json


def test_figure_with_newlines_and_spaces():
    html = u'<figure>\n      <img src="abc">   \n</figure>'
    json = {
        u'tag': u'figure',
        u'child': [
            {
                u'tag': u'img',
                u'attr': {
                    u'src': u'abc'
                }
            }
        ]
    }

    dut = Element.parse(html)

    assert dut.tag == u'figure'
    assert dut.child[0].tag == u'img'

    assert dut.render() == json


def test_figure_with_caption():
    html = u'<figure><img src="abc"><figcaption>caption</figcaption></figure>'
    json = {
        u'tag': u'figure',
        u'child': [
            {
                u'tag': u'img',
                u'attr': {
                    u'src': u'abc'
                }
            }, {
                u'tag': u'figcaption',
                u'text': u'caption'
            }
        ]
    }

    dut = Element.parse(html)

    assert dut.tag == u'figure'
    assert dut.child[0].tag == u'img'
    assert dut.child[1].tag == u'figcaption'

    assert dut.render() == json


def test_div_with_two_child():
    html = u'<div><p></p><p></p></div>'
    json = {
        u'tag': u'div',
        u'child': [{
            u'tag': u'p'
        }, {
            u'tag': u'p'
        }]
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.child[0].tag == u'p'
    assert dut.child[1].tag == u'p'

    assert dut.render() == json


def test_div_with_nested_child():
    html = u'<div><p><textarea></textarea></p></div>'
    json = {
        u'tag': u'div',
        u'child': [{
            u'tag': u'p',
            u'child': [{
                u'tag': u'textarea'
            }]
        }]
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.child[0].tag == u'p'
    assert dut.child[0].child[0].tag == u'textarea'

    assert dut.render() == json


def test_div_with_two_nested_child():
    html = u'<div><p><textarea></textarea></p><p></p></div>'
    json = {
        u'tag': u'div',
        u'child': [{
            u'tag': u'p',
            u'child': [{
                u'tag': u'textarea'
            }]
        }, {
            u'tag': u'p'
        }]
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.child[0].tag == u'p'
    assert dut.child[0].child[0].tag == u'textarea'
    assert dut.child[1].tag == u'p'

    assert dut.render() == json


def test_unary():
    html = u''.join(
        [
            u'<div id="1" class="foo bar">',
            u'<h2>sample text</h2>',
            u'<input id="execute" type="button" value="execute"/>',
            u'<img src="photo.jpg" alt="photo"/>',
            u'</div>'
        ]
    )

    json = {
        u'tag': u'div',
        u'attr': {
            u'id': u'1',

            u'class': [u'foo', u'bar']

        },
        u'child': [{
            u'tag': u'h2',
            u'text': u'sample text'
        }, {
            u'tag': u'input',
            u'attr': {
                u'id': u'execute',
                u'type': u'button',
                u'value': u'execute'
            }
        }, {
            u'tag': u'img',
            u'attr': {
                u'src': u'photo.jpg',
                u'alt': u'photo'
            }
        }]
    }

    dut = Element.parse(html)

    assert dut.render() == json


def test_div_with_inline_tag1():
    html = u'<div>this is a <b>div</b></div>'
    json = {
        u'tag': u'div',
        u'text': u'this is a <b>div</b>'
    }

    dut = Element.parse(html)

    assert dut.tag == u'div'
    assert dut.text == u'this is a <b>div</b>'

    assert dut.render() == json


def test_div_with_inline_tag2():
    html = u'<p>sample text with tag <strong>like</strong> this</p>'
    json = {
        u'tag': u'p',
        u'text': u'sample text with tag <strong>like</strong> this'
    }

    dut = Element.parse(html)

    assert dut.render() == json


def test_div_with_inline_tag3():
    html = u''.join([
        u'<div id="1" class="foo bar">',
        u'<p>sample text with tag <strong>like</strong> this</p>',
        u'<p><strong>with</strong> inline tag</p>',
        u'</div>'
    ])

    json = {
        u'tag': u'div',
        u'attr': {
            u'id': u'1',
            u'class': [u'foo', u'bar']
        },
        u'child': [{
            u'tag': u'p',
            u'text': u'sample text with tag <strong>like</strong> this'
        }, {
            u'tag': u'p',
            u'text': u'<strong>with</strong> inline tag'
        }]
    }

    dut = Element.parse(html)

    # print dut.render()
    assert dut.render() == json


def test_parse_what_the_guy_wants():

    json = {
        u'tag': u'div',
        u'attr': {
            u'id': u'1',
            u'class': [u'foo']
        },
        u'child': [{
            u'tag': u'h2',
            u'text': u'sample text with <code>inline tag</code>'
        }, {
            u'tag': u'pre',
            u'attr': {
                u'id': u'demo',
                u'class': [u'foo', u'bar']
            }
        }, {
            u'tag': u'pre',
            u'attr': {
                u'id': u'output',
                u'class': [u'goo']
            }
        }, {
            u'tag': u'input',
            u'attr': {
                u'id': u'execute',
                u'type': u'button',
                u'value': u'execute'
            }
        }]
    }

    html = u''.join([
        u'<div id="1" class="foo">',
        u'<h2>sample text with <code>inline tag</code></h2>',
        u'<pre id="demo" class="foo bar"></pre>',
        u'<pre id="output" class="goo"></pre>',
        u'<input id="execute" type="button" value="execute"/>',
        u'</div>'
    ])

    dut = Element.parse(html)
    assert dut.render() == json

