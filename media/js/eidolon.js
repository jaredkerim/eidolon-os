(function () {
    eidol_template = null;

    curr_eidol = 1;
    eidols = {};

    function get_eidol(html) {
        eidol_id = $(html).attr('id');
        eidol = eidols[eidol_id];
        return eidol;
    }

    curr_align = true;

    function get_alignment() {
        curr_align = !curr_align;
        return curr_align;
    }

    function Eidol(id, title, body) {
        
        // Initialize
        this.init = function(id, title, body) {
            // Attributes
            this.id = id;
            this.title = title;
            this.body = body;
            this.isOpen = false;
            this.wasOpen = false;
            this.draggable = true;
            this.dragging = false;
            this.edit_title = false;
            this.dock_align = get_alignment();
           
            // Add to Eidol Index
            eidols[id] = this;
            
            // Render HTML
            $('.eidol_staging').append(eidol_template, {
                id      : this.id,
                title   : this.title,
                body    : this.body,
            });

            // Eidol Draggable
            this.get().draggable({
                scroll              : false,
                handle              : '.drag_handle',
                revert              : true, 
            });

            // Edit Title
            eidol = this;
            this.get().find('.edit_title_icon').click(function () {
                html = eidol.get();
                if(eidol.edit_title) {
                    eidol.draggable = true;
                    html.draggable('enable');
                    html.find('.title').attr('contenteditable', 'false');
                    html.find('.edit_title_icon').attr('src', '/media/imgs/icons/edit_title.png');
                } else {
                    eidol.draggable = false;
                    html.draggable('disable');
                    html.find('.title').attr('contenteditable', 'true');
                    html.find('.edit_title_icon').attr('src', '/media/imgs/icons/save_title.png');
                    html.find('.title').focus();
                    html.find('.title').bind('keydown', function(e) {
                        if(e.keyCode == 13) {
                            eidol.get().find('.title').blur();
                            eidol.get().find('.edit_title_icon').click();
                            return false;
                        }
                    });
                }
                eidol.edit_title = !eidol.edit_title;
            });


        }

        this.get = function() {
            return $('.eidol[id=' + this.id + ']');
        }

        this.open = function(callback) {
            if(!this.isOpen) {
                console.log('Opening ' + this.id);
                this.isOpen = true;

                html = this.get();
                html.switchClass('closed', 'open', 200, function () { 
                    html.draggable('option', 'cursorAt', {
                        top     : html.height()/2.0, 
                    });
                    if(callback)
                        callback();
                });
            }
        }

        this.close = function(callback) {
            if(this.isOpen) {
                console.log('Closing ', this.id, ' Drag ', this.dragging);
                eidol = this;
                eidol.isOpen = false;

                html = eidol.get();
                html.switchClass('open', 'closed', 200, function () { 
                    html.draggable('option', 'cursorAt', false);
                    if(callback)
                        callback();
                });
            } else {
                if(this.wasOpen) {
                    this.wasOpen = false;
                    manager.focus.clear();
                }
                callback();
            }
        }

        this.leftClick = function(callback) {
            console.log('Left Clicked ' + this.id);

            eidol = this;
            if(!eidol.isOpen && !eidol.dragging) {
                manager.focus.add(eidol, callback);
            }
            if(eidol.dragging) {
                position = eidol.get().offset();
                console.log('Released at ', position.left, position.top, ' in ', eidol.get().parent()[0].className);
            }
        }

        this.rightClick = function (callback) {
            console.log('Right Clicked ' + this.id);
            eidol = this;
            if(this.isOpen) {
                this.close(function () {
                    manager.dock.add(eidol, function () {
                        manager.focus.clear(callback);
                    });
                })
            }
        }

        this.drag = function(callback) {
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
        }

        this.drop = function(target, callback) {
            console.log('Dropped ', this.id, ' at ', eidol.get().position());
            eidol = this;

            eidol.dragging = false;
            if(eidol.wasOpen) {
                eidol.open();
                eidol.wasOpen = false;
            }
        }

        this.init(id, title, body);
    }

    function History() {
    }

    function Focus() {
        this.focus = null;
     
        this.get = function () {
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
                eidol.get().animate({
                    left : delta_x,
                }, 200, function () { 
                    console.log('animation complete');
                    eidol.get().attr('style', 'position: relative;');
                    manager.focus.focus = eidol;
                    manager.focus.get().html(eidol.get());
                    eidol.open(callback);
                });
            }
            if(manager.focus.focus) {
                manager.focus.focus.rightClick(function () { 
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

    function SideDock (html, alignment) {
        this.html = html;
        this.html.disableSelection();
        
        this.alignment = alignment;

        this.html.droppable({
            tolerance   : 'pointer',
            drop        : function (event, ui) {
                console.log(this.className, 'dropped on');
                dock = manager.dock.get_dock(this.className);
                eidol = get_eidol(ui.draggable);
                eidol.close(function () { 
                    dock.add(eidol);
                });
                
            }
        });

        
        this.add = function(eidol, callback) {
            dock = this;
            
            width = $(window).width();
            height = $(window).height();
            center_x = width/2.0;
            center_y = height/2.0;

            eidol_offset = eidol.get().offset();
            eidol_left = eidol_offset.left;
            eidol_top = eidol_offset.top;
            eidol_x = eidol_left + (eidol.get().width()/2.0);
            eidol_y = eidol_top + (eidol.get().height()/2.0);
            if(eidol.dragging) {
                if(eidol_x < center_x) {
                    console.log('Left');
                    delta_x = '-=' + eidol_x;
                } else {
                    console.log('Right');
                    delta_x = '+=' + (width - (eidol_left + eidol.get().width()));
                }
                if(eidol_y < center_y) {
                    console.log('Top');
                    delta_y = '+=' + (center_y - eidol_y);                
                } else {
                    console.log('Bottom');
                    delta_y = '-=' + (eidol_y - center_y);
                }
            } else {
                center_x = $(window).width()/2.0;
                eidol_x = eidol.get().offset().left
                if(this.alignment) {
                    delta_x = '-=' + eidol_left;
                    delta_y = '';
                } else {
                    delta_x = '+=' + (width - (eidol_left + eidol.get().width()));
                    delta_y = '';
                }
            }
            console.log('Animating ', delta_x, delta_y);
            eidol.get().animate({
                left : delta_x,
                top  : delta_y,
            }, 200, function () { 
                console.log('animation complete');
                eidol.get().attr('style', 'position: relative;');
                eidol.dock_align = dock.alignment;
                dock.html.append(eidol.get());
                if(callback)
                    callback();
            });
        }

        this.remove = function(eidol) {
        }
    }

    function Dock () {
        this.left_dock = new SideDock($('.left_dock'), true);
        this.right_dock = new SideDock($('.right_dock'), false);

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

    function Launcher() {
    }


    $(document).ready(function () {
        // UI Objects
        manager = {
            history     : new History(),
            dock        : new Dock(),
            focus       : new Focus(),
            launcher    : new Launcher(),
        }

        // Eidol Template
        eidol_template = $.template($('.eidol.template')[0].outerHTML.replace('template', ''));
        $('.eidol.template').remove();

        // Disable Right Click
        $('body').noContext();

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
            eidol = eidols[eidol_id];
            eidol.drag();
        });

        // Eidol Drag Starts
        $('.eidol').live('dragstop', function(event, ui) {
           eidol_id = $(this).attr('id');
            eidol = eidols[eidol_id];
            eidol.drop();
        });

        $('.launcher').live('click', function () {
            //eidol = new Eidol(curr_eidol, 'New Eidol', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet diam tortor. Quisque et diam a lorem dapibus ullamcorper nec sit amet nunc. Sed sit amet erat in nisl egestas placerat. Praesent lacinia fermentum gravida. Donec dictum, neque sit amet suscipit auctor, tortor justo vestibulum massa, quis feugiat nulla mi semper risus. Donec ipsum ligula, ullamcorper ut egestas vel, commodo vel lectus. Cras euismod ante eu orci molestie luctus. Praesent a ante id nisl bibendum rutrum. Maecenas a ligula sapien. Donec consectetur, ante id consectetur blandit, purus orci fermentum magna, congue tincidunt orci magna eget leo. Nam sodales libero vel velit sagittis placerat. Sed libero justo, accumsan ut tincidunt non, aliquet vel leo. Nam mollis vestibulum pharetra. Ut eu odio orci, quis malesuada purus. Nulla rhoncus sapien eu nunc convallis sed auctor mi congue. Etiam sed ligula auctor lorem dignissim congue et in lectus. Integer a magna lacus, sit amet congue nisl.');
            eidol = new Eidol(curr_eidol++, 'Title', '');
            manager.focus.add(eidol);
        });
    });
})();
