(function () {
    var global = this;

    var Eidolon = (global.Eidolon || (global.Eidolon = {}));

    var Launcher = Eidolon.Launcher = function () {

        // Events
        $('.launcher').live('click', function () {
            eidol = new Eidolon.Eidol({
                title: 'Title',
                body: ''
            });
            Eidolon.Manager.focus.add(eidol);
        });
    }
}).call(this);
