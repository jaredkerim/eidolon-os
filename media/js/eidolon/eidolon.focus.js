(function () {
    var global = this;


    var Eidolon = (global.Eidolon || (global.Eidolon = {}));

    var Focus = Eidolon.Focus = function () {
        this.focus = null;
     
        this.get_element = function () {
            return $('#focus');
        }

        this.add = function(eidol, callback) {
            Eidolon.Manager.focus.focus = eidol;
            Eidolon.Manager.focus.get_element().html(eidol.get_element());
            eidol.open(callback);
        }

        this.clear = function (callback) {
            this.focus = null;
            if(callback)
                callback();
        }
    }
}).call(this);
