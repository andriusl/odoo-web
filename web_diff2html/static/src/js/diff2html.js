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
    render_value: function() {
        this._super();
        // Show in HTML if it is readonly.
        var value = this.get('value');
        if (value && this.get("effective_readonly")) {
            // Convert diff to json diff equivalent.
            // We need to use `getJsonFromDiff` function because we need
            // to pass actual value to render it, instead of directly
            // modifying element using ID or class name (as showed in
            // diff2html guide).
            // Get config from field definition in view
            var cfg = toJSON(this.node.attrs['data-diff2html']) || {
                "options": {"inputFormat": "diff"}, "extra": {
                    "highlightCode": true}};
            if (cfg.options.inputFormat !== 'json'){
                var diffJson = Diff2Html.getJsonFromDiff(value);
            } else {
                // If it is json, we do not need to convert it.
                diffJson = value;
            }
            // Overwrite inputFormat to be jSon, because we will be
            // using jSon from now on.
            cfg.options.inputFormat = 'json'
            var diffHtml = Diff2Html.getPrettyHtml(diffJson, cfg.options),
            // Convert string HTML to jQuery.
                $content = $($.parseHTML(diffHtml)),
                diff2htmlUi = new Diff2HtmlUI();
            // Highlight code using jQuery object, because string
            // type would be used to search for element, not use
            // actual string HTML.
            if (cfg.extra.highlightCode){
                diff2htmlUi.highlightCode($content);
            }
            if (cfg.extra.fileListCloseable){
                diff2htmlUi.fileListCloseable($content, false);
            }
            // Combine lines summary and actual diff lines. And
            // convert result back to string.
            var result = ''
            _.each($content, function(obj) {
                result += obj.outerHTML
            });
            this.$content.html(this.text_to_html(result))
        }
    }
})

core.form_widget_registry.add('diff2html', FieldDiff2Html)

});
