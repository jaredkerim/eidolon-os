(function () {
    var global = this;


    var Eidolon = (global.Eidolon || (global.Eidolon = {}));

    // List of all Eidols
    var num_eidols = 0;
    var global_eidols = Eidolon.global_eidols = {};


    // Alignment
    var curr_align = true;

    function get_alignment() {
        curr_align = !curr_align;
        return curr_align;
    }

    var get_eidol = Eidolon.get_eidol = function (html) {
        eidol_id = $(html).attr('id');
        eidol = global_eidols[eidol_id];
        return eidol;
    }

    // Eidol prototype
    var Eidol = Eidolon.Eidol = Backbone.Model.extend({
        initialize: function () {
            this.id = num_eidols++;
            this.isOpen = false;
            this.wasOpen = false;
            this.draggable = true;
            this.dragging = false;
            this.edit_title = false;
            this.dock_align = get_alignment();

            // Add to Global List
            global_eidols[this.id] = this;

            // Add to DOM
            this.render();
            
            // Eidol Draggable
            this.get_element().draggable({
                scroll              : false,
                handle              : '.drag_handle',
                revert              : true, 
            });
        },

        render: function () {
            $('.eidol_staging').append(Eidolon.eidol_template, {
                id      : this.id,
                title   : this.get('title'),
                body    : this.get('body'),
            });
        },

        get_element: function () {
            return $('.eidol[id=' + this.id + ']');
        },
        
        open: function(callback) {
            if(!this.isOpen) {
                console.log('Opening ' + this.id);
                this.isOpen = true;

                html = this.get_element();
                html.switchClass('closed', 'open', 200, function () { 
                    html.draggable('option', 'cursorAt', {
                        top     : html.height()/2.0, 
                    });
                    if(callback)
                        callback();
                });
            }
        },

        close: function(callback) {
            if(this.isOpen) {
                console.log('Closing ', this.id, ' Drag ', this.dragging);
                eidol = this;
                eidol.isOpen = false;

                html = eidol.get_element();
                html.switchClass('open', 'closed', 200, function () { 
                    html.draggable('option', 'cursorAt', false);
                    if(callback)
                        callback();
                });
            } else {
                if(this.wasOpen) {
                    this.wasOpen = false;
                    Eidolon.Manager.focus.clear();
                }
                callback();
            }
        },

        leftClick: function(callback) {
            console.log('Left Clicked ' + this.id);

            eidol = this;
            if(!eidol.isOpen && !eidol.dragging) {
                Eidolon.Manager.focus.add(eidol, callback);
            }
            if(eidol.dragging) {
                position = eidol.get_element().offset();
                console.log('Released at ', position.left, position.top, ' in ', eidol.get_element().parent()[0].className);
            }
        },

        rightClick: function (callback) {
            console.log('Right Clicked ' + this.id);
            eidol = this;
            if(this.isOpen) {
                this.close(function () {
                    Eidolon.Manager.dock.add(eidol, function () {
                        Eidolon.Manager.focus.clear(callback);
                    });
                })
            }
        },

        drag: function(callback) {
            if(this.draggable) {
                console.log('Dragging ', this.id);
                eidol = this;
                
                eidol.dragging = true;
                if(eidol.isOpen) {
                    eidol.wasOpen = true;
                    eidol.close();
                } else {
                    eidol.wasOpen = false;
                }
            }
        },

        drop: function(target, callback) {
            console.log('Dropped ', this.id, ' at ', eidol.get_element().position());
            eidol = this;

            eidol.dragging = false;
            if(eidol.wasOpen) {
                eidol.open();
                eidol.wasOpen = false;
            }
        }
    });

    // Events
    $('.eidol').live('mouseup', function(event) {
        eidol = get_eidol(this);
        if(event.button == 0) {
            eidol.leftClick();
        } else if (event.button == 2) {
            eidol.rightClick();
        }
    });

    // Eidol Drag Starts
    $('.eidol').live('dragstart', function(event, ui) {
        eidol_id = $(this).attr('id');
        eidol = global_eidols[eidol_id];
        eidol.drag();
    });

    // Eidol Drag Starts
    $('.eidol').live('dragstop', function(event, ui) {
       eidol_id = $(this).attr('id');
        eidol = global_eidols[eidol_id];
        eidol.drop();
    });
}).call(this);
