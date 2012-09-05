(function () {
    var global = this;

    var Eidolon = (global.Eidolon || (global.Eidolon = {}));

    var Dock = Eidolon.Dock = function () {
        this.left_dock = new Eidolon.SideDock($('.left_dock'), true);
        this.right_dock = new Eidolon.SideDock($('.right_dock'), false);

        this.add = function(eidol, callback) {
            if(eidol.dock_align) {
                this.left_dock.add(eidol, callback);
            } else {
                this.right_dock.add(eidol, callback);
            }
        }

        this.get_dock = function(className) {
            if(className.match('left_dock')) {
                return this.left_dock;
            } else if (className.match('right_dock')) {
                return this.right_dock;
            }
        }

        this.remove = function(eidol) {
        }
    }
}).call(this);
