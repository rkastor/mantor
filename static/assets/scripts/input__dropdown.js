
    var inputDrop       = $('.input__dropdown');

    inputDrop.each(function(index, item) {
        inputSiblHidden  = $(this).siblings('input[type="hidden"]'),
        inputDropCurrent = $(this).find('.drop-current'),
        inputDropList    = $(this).find('.drop-list');

        if (inputSiblHidden.val().length != 0) {
            inputDropCurrent.text(inputSiblHidden.val());
        }

        $(this).on('click', function() {
            $(item).not(this).removeClass('toggled');
            $(this).toggleClass('toggled');
        });

        inputDropList.on('click', 'li', function(e) {
            e.preventDefault();
            
            var val = $(this).attr('value');
            
            inputDropCurrent.text(val).removeClass('error');
            inputSiblHidden.val(val).bind('input');
        })
    });