Diff To HTML
============

Converts diff output of a field value to prettified HTML.
(e.g. as seen on github, bitbucket etc.).

Usage:

* Field must be of `HTML` type.
* Set `widget="diff2html"` on field where it is defined in a form view.

This module uses `diff2html`_ as a base library to generate HTML diff.

*This a sample diff2html implementation in Odoo using this widget:*

.. image:: ../web_diff2html/static/description/img/diff1.png
    :height: 500px
    :align: right
    :alt: Diff to HTML sample

Contributors
------------

* Andrius Laukavičius

.. _diff2html: https://github.com/rtfpessoa/diff2html
