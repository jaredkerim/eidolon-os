(function () {
    var global = this;

    var Eidolon = (global.Eidolon || (global.Eidolon = {}));

    
    var Initialize = Eidolon.Initialize = function (options) {
        
        // Eidol Template
        Eidolon.eidol_template = $.template($('.eidol.template')[0].outerHTML.replace('template', ''));
        $('.eidol.template').remove();

        // UI Objects
        var Manager = Eidolon.Manager = {
            history     : new Eidolon.History(),
            dock        : new Eidolon.Dock(),
            focus       : new Eidolon.Focus(),
            launcher    : new Eidolon.Launcher(),
        }

        // Disable Right Click
        $('body').noContext();
    }
}).call(this);
