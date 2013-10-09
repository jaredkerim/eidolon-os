(function () {
    var global = this;

    var Eidolon = (global.Eidolon || (global.Eidolon = {}));

    var SideDock = Eidolon.SideDock = function(html, alignment) {
        this.html = html;
        
        this.alignment = alignment;

        //this.html.droppable({
        //    tolerance   : 'pointer',
        //    drop        : function (event, ui) {
        //        console.log(this.className, 'dropped on');
        //        dock = Eidolon.Manager.dock.get_dock(this.className);
        //        eidol = Eidolon.get_eidol(ui.draggable);
        //        eidol.close(function () { 
        //            dock.add(eidol);
        //        });
        //        
        //    }
        //});

        this.add = function(eidol, callback) {
            dock = this;
            
            width = $(window).width();
            height = $(window).height();
            center_x = width/2.0;
            center_y = height/2.0;

            eidol_offset = eidol.get_element().offset();
            eidol_left = eidol_offset.left;
            eidol_top = eidol_offset.top;
            eidol_x = eidol_left + (eidol.get_element().width()/2.0);
            eidol_y = eidol_top + (eidol.get_element().height()/2.0);
            if(eidol.dragging) {
                if(eidol_x < center_x) {
                    console.log('Left');
                    delta_x = '-=' + eidol_x;
                } else {
                    console.log('Right');
                    delta_x = '+=' + (width - (eidol_left + eidol.get_element().width()));
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
                eidol_x = eidol.get_element().offset().left
                if(this.alignment) {
                    delta_x = '-=' + eidol_left;
                    delta_y = '';
                } else {
                    delta_x = '+=' + (width - (eidol_left + eidol.get_element().width()));
                    delta_y = '';
                }
            }
            console.log('Animating ', delta_x, delta_y);
            eidol.get_element().animate({
                left : delta_x,
                top  : delta_y,
            }, 200, function () { 
                console.log('animation complete');
                eidol.get_element().attr('style', 'position: relative;');
                eidol.dock_align = dock.alignment;
                dock.html.append(eidol.get_element());
                if(callback)
                    callback();
            });
        }

        this.remove = function(eidol) {
        }
    }
}).call(this);
