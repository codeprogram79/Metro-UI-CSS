var ButtonGroupDefaultConfig = {
    buttongroupDeferred: 0,
    targets: "button",
    clsActive: "active",
    requiredButton: false,
    mode: Metro.groupMode.ONE,
    onButtonClick: Metro.noop,
    onButtonsGroupCreate: Metro.noop
};

Metro.buttonGroupSetup = function(options){
    ButtonGroupDefaultConfig = $.extend({}, ButtonGroupDefaultConfig, options);
};

if (typeof window["metroButtonGroupSetup"] !== undefined) {
    Metro.buttonGroupSetup(window["metroButtonGroupSetup"]);
}

var ButtonGroup = {
    name: "ButtonGroup",

    init: function( options, elem ) {
        this.options = $.extend( {}, ButtonGroupDefaultConfig, options );
        this.elem  = elem;
        this.element = $(elem);
        this.active = null;

        this._setOptionsFromDOM();
        Metro.createExec(this);

        return this;
    },

    _setOptionsFromDOM: function(){
        var element = this.element, o = this.options;

        $.each(element.data(), function(key, value){
            if (key in o) {
                try {
                    o[key] = JSON.parse(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },

    _create: function(){
        var element = this.element, o = this.options;

        Metro.checkRuntime(element, "buttongroup");

        this._createGroup();
        this._createEvents();

        Utils.exec(o.onButtonsGroupCreate, [element]);
        element.fire("buttongroupcreate");
    },

    _createGroup: function(){
        var element = this.element, o = this.options;
        var buttons, buttons_active, id = Utils.elementId("button-group");

        if (element.attr("id") === undefined) {
            element.attr("id", id);
        }

        element.addClass("button-group");

        buttons = element.find( o.targets );
        buttons_active = element.find( "." + o.clsActive );

        if (o.mode === Metro.groupMode.ONE && buttons_active.length === 0 && o.requiredButton === true) {
            $(buttons[0]).addClass(o.clsActive);
        }

        if (o.mode === Metro.groupMode.ONE && buttons_active.length > 1) {
            buttons.removeClass(o.clsActive);
            $(buttons[0]).addClass(o.clsActive);
        }

        element.find( "." + o.clsActive ).addClass("js-active");
    },

    _createEvents: function(){
        var element = this.element, o = this.options;

        element.on(Metro.events.click, o.targets, function(){
            var el = $(this);

            Utils.exec(o.onButtonClick, [el], this);
            element.fire("buttonclick", {
                button: this
            });

            if (o.mode === Metro.groupMode.ONE && el.hasClass(o.clsActive)) {
                return ;
            }

            if (o.mode === Metro.groupMode.ONE) {
                element.find(o.targets).removeClass(o.clsActive).removeClass("js-active");
                el.addClass(o.clsActive).addClass("js-active");
            } else {
                el.toggleClass(o.clsActive).toggleClass("js-active");
            }

        });
    },

    changeAttribute: function(attributeName){
    },

    destroy: function(){
        var element = this.element, o = this.options;
        element.off(Metro.events.click, o.targets);
        return element;
    }

};

Metro.plugin('buttongroup', ButtonGroup);