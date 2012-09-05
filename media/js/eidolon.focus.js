(function () {
    var global = this;


    var Eidolon = (global.Eidolon || (global.Eidolon = {}));

    var Focus = Eidolon.Focus = function () {
        this.focus = null;
     
        this.get_element = function () {
            return $('.focus');
        }

        this.add = function(eidol, callback) {
            move_to_center = function (eidol) {
                center_x = $(window).width()/2.0;
                if(eidol.dock_align) {
                    delta_x = '+=' + center_x;
                } else {
                    delta_x = '-=' + center_x;
                }
                eidol.get_element().animate({
                    left : delta_x,
                }, 200, function () { 
                    console.log('animation complete');
                    eidol.get_element().attr('style', 'position: relative;');
                    Eidolon.Manager.focus.focus = eidol;
                    Eidolon.Manager.focus.get_element().html(eidol.get_element());
                    eidol.open(callback);
                });
            }
            if(Eidolon.Manager.focus.focus) {
                Eidolon.Manager.focus.focus.rightClick(function () { 
                    move_to_center(eidol);
                });
            } else {
                move_to_center(eidol);
            }

        }

        this.clear = function (callback) {
            this.focus = null;
            if(callback)
                callback();
        }
    }
}).call(this);
