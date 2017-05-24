odoo.define('web_diff2html.diff2html', function (require) {
"use strict";
/*global Diff2HtmlUI*/
var core = require('web.core');
var editor_backend = require('web_editor.backend')
var FieldTextHtmlSimple = editor_backend['FieldTextHtmlSimple']

/**
 * Convert string hashmap into jSon object.
 * @param  {string} str string that represent jSon object.
 * @return {jSon or false} if valid Json representation is provided, it
 * returns jSon object, otherwise returns false.
 */
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
    /**
     * Build options and extra options config to apply different effects
     * on diff2html styling.
     * @return {object} configuration object. If no data was specified
     *     in XML, return object with default values.
     */
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
    /**
     * Apply extra options like code highlighting or closeable files
     * list. Can be extended to apply additional options.
     * @param  {object} extra  config containing extra options.
     * @param  {string or jQuery} target target that options should be
     *     applied. If string is specified, it expects to be identifier
     *     for element like ID or classname. Note using string, might
     *     not work for this widget out of the box.
     * @return {diff2htmlUi} instance extra options are applied on. Can
     *     be used easier extension to apply additional options.
     */
    apply_extra: function(extra, target) {
        var diff2htmlUi = new Diff2HtmlUI();
        if (extra.highlightCode){
            diff2htmlUi.highlightCode(target);
        }
        if (extra.fileListCloseable){
            // Determine if we need to show files list on default or not.
            var default_val = extra.fileListCloseableDefault,
                default_close = default_val ? default_val : false;
            diff2htmlUi.fileListCloseable(target, default_close);
        }
        // Return this object for easier extendability.
        return diff2htmlUi;
    },
    /**
     * Render diff into HTML. diff2html is only active in readonly mode.
     * @return {undefined}
     */
    render_value: function() {
        this._super();
        // We access value using jQuery, because using Odoo
        // `this.get('value')` is clunky for diff2html: it wraps content
        // in `p` tag.
        var value = this.$content.text();
        // Show in HTML only if it is readonly.
        if (value && this.get("effective_readonly")) {
            // Get config from field definition in view
            var cfg = this.get_config(),
                diff2htmlUi = new Diff2HtmlUI({diff: value});
            diff2htmlUi.draw(this.$content, cfg.options);
            // Apply extra config options
            this.apply_extra(cfg.extra, this.$content)
        }
    }
})

core.form_widget_registry.add('diff2html', FieldDiff2Html)

});
