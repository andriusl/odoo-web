odoo.define('git_integration.diff', function (require) {
"use strict";
var core = require('web.core');
var editor_backend = require('web_editor.backend')
var FieldTextHtmlSimple = editor_backend['FieldTextHtmlSimple']

var FieldDiff2Html = FieldTextHtmlSimple.extend({
    render_value: function(){
        this._super();
        // Show in HTML if it is readonly.
        if (this.get("effective_readonly")) {
            // Convert diff to json diff equivalent.
            // We need to use `getJsonFromDiff` function because we need
            // to pass actual value to render it, instead of directly
            // modifying element using ID or class name (as showed in
            // diff2html guide).
            var value = this.get('value'),
                diffJson = Diff2Html.getJsonFromDiff(value),
                cfg = {"inputFormat": 'json', "showFiles": true},
                diffHtml = Diff2Html.getPrettyHtml(diffJson, cfg);
                // Convert string HTML to jQuery.
                var $content = $($.parseHTML(diffHtml));
                var diff2htmlUi = new Diff2HtmlUI();
                // Highlight code using jQuery object, because string
                // type would be used to search for element, not use
                // actual string HTML.
                diff2htmlUi.highlightCode($content);
                // Combine lines summary and actual diff lines. And
                // convert result back to string.
                this.$content.html(this.text_to_html(
                    $content[0].outerHTML + $content[1].outerHTML));
        }
    }
})

core.form_widget_registry.add('diff2html', FieldDiff2Html)

});
