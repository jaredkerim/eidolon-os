(function () {
    var global = this;

    var Eidolon = (global.Eidolon || (global.Eidolon = {}));

    
    var Initialize = Eidolon.Initialize = function (options) {
        
        // UI Objects
        var Manager = Eidolon.Manager = {
            history     : new Eidolon.History(),
            dock        : new Eidolon.Dock(),
            focus       : new Eidolon.Focus(),
            launcher    : new Eidolon.Launcher(),
        }
    }
}).call(this);
