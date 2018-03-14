/*
 http://www.010soft.com 
*/

(function ( $ ) {

    var methods = {
       init : function(options) {
           run_run.call(this, options);
       },
       startupload: function() {     //software start upload
           start_upload.call(this);
       }, 
/*       destroy : function( ) {
         return this.each(function(){
           $(this).removeData('uploadoptions');
         })
       }
*/

    };

    function error_handler( options , err_message )
    {
        if( options.onerror )
        {
            options.onerror();
        }

        if( options.showerrorstatus )
        {
            if( options.infodiv )
            {
               options.infodiv.text( err_message );
            }
        }
        hide_progress_bar(options);
    }

    function hide_progress_bar(options)
    {
       if( options.progressbar )
       {
           options.progressbar.css('width', '0%');
           options.progressbar.hide();
       }
       if( options.progressdiv )
       {
           options.progressdiv.hide();
       }
       if( options.btnstart )
       {
          options.btnstart.attr('disabled' , true );
       }
    }

    function show_progress_bar(options)
    {
       if( options.progressbar )
       {
           options.progressbar.css('width', '0%');
           options.progressbar.show();
       }
       if( options.progressdiv )
       {
           options.progressdiv.show();
       }
    }



    function success_handler( options, data )
    {
        hide_progress_bar(options);

        if( options.infodiv )
        {
            options.infodiv.text('');
        }

        if( options.onsuccess )
        {
            options.onsuccess(data);
        }
    }

    function complete_handler( options )
    {
        if( options.oncomplete )
        {
            options.oncomplete();
        }
    }



    function start_upload(options)
    {
        if( options.beforeupload )
        {
            options.beforeupload();
        }

        show_progress_bar(options);


       var object_context = this;
       var formData = new FormData($(this)[0]);
       var action = $(this).attr('action');

        $.ajax({
          xhr: function()
          {
            var xhr = new window.XMLHttpRequest();

            xhr.upload.addEventListener("progress", function(evt){
              if (evt.lengthComputable) {

                if( options.progress )
                {
                   options.progress( evt.loaded, evt.total );
                }
                else
                {
                   var percentComplete = parseInt(evt.loaded/evt.total * 100, 10);
                   if( options.progressdiv ){  options.progressdiv.show(); }
                   if( options.progressbar )
                   {
                       options.progressbar.css('width', percentComplete + '%');
                   }
                }

              }
            }, false);

           return xhr;
          },
          type: 'POST',
          url: action,
          data: formData,
          processData: false, 
          contentType: false,
          cache: false,
          dataType: 'json',
          success: function(data, textStatus, jqXHR){
            if(typeof data.error === 'undefined')
            {
                 success_handler.call( object_context, options, data );
            }
            else
            {
                error_handler.call( object_context , data.error );
            }
            //Do something success-ish
          },
          error: function(jqXHR, textStatus, errorThrown){
             error_handler.call( object_context , textStatus );
          },
          complete: function()
          {
              complete_handler.call( object_context, options );
         }

        });



    }

    function files_choosed(options)
    {
         var files_data = options.bntfile.prop("files");
         if( options.add )
         {
             //use user handler
             options.add( files_data );
         }
         else if( options.infodiv )
         {
            var count =0;
            var file_names = "";
            $.each(files_data, function (index, file) {
                count++;
                file_names += (file_names ? ',' : '' )+file.name;
            });

            if( count == 1 ) {
               options.infodiv.html( file_names );
            }
            else
            {
               if( file_names.length > options.max_file_names_label_length ) { file_names = file_names.substr( 0, options.max_file_names_label_length-3 )+"..." }
               options.infodiv.html( "Selected "+count+" file(s) ["+file_names+"]" );
            }

           //console.log( options.bntfile.prop("files"));
         }
    }

    function run_run(options)
    {
        var options = $.extend({
            bntfileclassselector: ".input-files",
            btnfileid: null,
            btnstartclassselector: ".start",
            btnstartid: null,
            infoclassselector: ".files-selected",
            infoid: null,
            progressdivselector: ".progress", 
            progressdivid: null, 
            progressbarselector: ".progress-bar", 
            progressbarid: null, 
            max_file_names_label_length: 20, 

            showerrorstatus: true, 
            autostartupload: false, 

            //events
            add: null , 
            beforeupload: null , 
            progress: null , 

            onsuccess : null ,
            onerror : null ,
            oncomplete : null ,


            //my , hidden
            bntfile : null ,
            btnstart: null, 
            infodiv: null, 
            progressdiv: null, 
            progressbar: null

        }, options );


        // Greenify the collection based on the settings variable.
            return this.each(function() {

                if( options.btnfileid ) 
                {
                   options.bntfile = options.btnfileid.substr(0, 1 ) == '#' ? $(options.btnfileid) : $('#'+options.btnfileid);
                }
                else if ( options.bntfileclassselector )
                {
                   options.bntfile = $(this).find(options.bntfileclassselector);
                }
                if( options.bntfile.length == 0 ) { options.bntfile = null; }

                if( options.btnstartid ) 
                {
                   options.btnstart = options.btnstartid.substr(0, 1 ) == '#' ? $(options.btnstartid) : $('#'+options.btnstartid);
                }
                else if ( options.btnstartclassselector )
                {
                   options.btnstart = $(this).find(options.btnstartclassselector);
                }
                if( options.btnstart.length == 0 ) { options.btnstart = null; }


                if( options.infoid ) 
                {
                   options.infodiv = options.infoid.substr(0, 1 ) == '#' ? $(options.infoid) : $('#'+options.infoid);
                }
                else if ( options.infoclassselector )
                {
                   options.infodiv = $(this).find(options.infoclassselector);
                }
                if( options.infodiv.length == 0 ) { options.infodiv = null; }

                if( options.progressdivid ) 
                {
                   options.progressdiv = options.progressdivid.substr(0, 1 ) == '#' ? $(options.progressdivid) : $('#'+options.progressdivid);
                }
                else if ( options.progressdivselector )
                {
                   options.progressdiv = $(this).find(options.progressdivselector);
                }
                if( options.progressdiv.length == 0 ) { options.progressdiv = null; }

                if( options.progressbarid ) 
                {
                   options.progressbar = options.progressbarid.substr(0, 1 ) == '#' ? $(options.progressbarid) : $('#'+options.progressbarid);
                }
                else if ( options.progressbarselector )
                {
                   options.progressbar = $(this).find(options.progressbarselector);
                }
                if( options.progressbar.length == 0 ) { options.progressbar = null; }

                var form_context = this;

                if( options.btnstart )
                {
                    options.btnstart.attr('disabled' , true );
                    options.btnstart.off('click').on('click', function(e)
                    {
                         //start upload
                         e.preventDefault();
                         start_upload.call( form_context , options);
                    });
                }

                if( options.bntfile )
                {
                   options.bntfile.off('change').on('change', function(e)
                   {
                         e.preventDefault();
                         files_choosed.call( form_context, options );
                         if( options.btnstart )
                         {
                             options.btnstart.removeAttr('disabled');
                         }
                         else if( options.autostartupload )
                         {
                              //auto start upload
                              start_upload.call( form_context , options);
                         }
                   });
                }

                if( options.progressdiv )
                {
                    options.progressdiv.hide();
                }

                $(this).data('uploadoptions', options );

        });
    }
 
    var uploader = function( methodOrOptions ) {
 
        // This is the easiest way to have default options.

        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on al.uploader' );
        }    
    };

    $.fn.al_upload = uploader;
 
}( jQuery ));