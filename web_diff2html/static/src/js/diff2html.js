odoo.define('web_diff2html.diff2html', function (require) {
"use strict";
/*global Diff2Html, Diff2HtmlUI*/
var core = require('web.core');
var editor_backend = require('web_editor.backend')
var FieldTextHtmlSimple = editor_backend['FieldTextHtmlSimple']

function toJSON(str) {
    try {
        if (typeof str != 'string'){
            return false
        }
        // Single quote is often used, so we ignore it.
        return JSON.parse(str.replace(/'/g, '"'));
    } catch (e) {
        return false;
    }
}

var FieldDiff2Html = FieldTextHtmlSimple.extend({
    get_config: function() {
        var cfg = toJSON(this.node.attrs['data-diff2html']) || {};
        // Add default objects for options and/or extra if they are were
        // not specified from XML.
        if (!cfg.options)
            cfg.options = {"inputFormat": "diff"}
        if (!cfg.extra)
            cfg.extra = {"highlightCode": true}
        return cfg;

    },
    get_diff_json: function(options, value) {
        if (options.inputFormat === 'json'){
            // If it is jSon, we do not need to convert it.
            return value;
        } else {
            // We need to use `getJsonFromDiff` function because we need
            // to pass actual value to render it, instead of directly
            // modifying element using ID or class name (as showed in
            // diff2html guide).
            return Diff2Html.getJsonFromDiff(value);
        }
    },
    html_to_jquery: function(html_str) {
        // Convert string HTML to jQuery.
        return $($.parseHTML(html_str));
    },
    apply_extra: function(extra, $content) {
        var diff2htmlUi = new Diff2HtmlUI();
        if (extra.highlightCode){
            diff2htmlUi.highlightCode($content);
        }
        if (extra.fileListCloseable){
            diff2htmlUi.fileListCloseable($content, false);
        }
        // Return this object for easier extendability.
        return diff2htmlUi;
    },
    render_value: function() {
        this._super();
        // We access value using jQuery, because using Odoo
        // `this.get('value')` is clunky: it wraps content in `p` tag.
        var value = this.$content.text();
        // Show in HTML only if it is readonly.
        if (value && this.get("effective_readonly")) {
            // Get config from field definition in view
            var cfg = this.get_config();
            // Convert diff to json diff equivalent.
            var diffJson = this.get_diff_json(cfg.options, value);
            // Overwrite inputFormat to be jSon, because we will be
            // using jSon from now on.
            cfg.options.inputFormat = 'json'
            var diffHtml = Diff2Html.getPrettyHtml(diffJson, cfg.options),
                // Convert string HTML to jQuery.
                $content = this.html_to_jquery(diffHtml);
            // Apply extra options like code highlight.
            this.apply_extra(cfg.extra, $content);
            // Combine lines summary and actual diff lines. And
            // convert result back to string.
            var result = '';
            _.each($content, function(obj) {
                result += obj.outerHTML
            });
            this.$content.html(result)
        }
    }
})

core.form_widget_registry.add('diff2html', FieldDiff2Html)

});
