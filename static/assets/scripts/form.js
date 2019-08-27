$(function() {

    var $multipleUpload = $('.multiple-input'),
        $multipleContainer = $('.additional-images');

    Array.prototype.remove = function(v) { this.splice(this.indexOf(v) == -1 ? this.length : this.indexOf(v), 1); }

    $('input[type="file"]').on('change', function () {
        var inputFiles = this.files,
            fileLength = inputFiles.length < 12 ? inputFiles.length : 12,
            thisInput  = $(this),
            thisParent = thisInput.parent('.file-space');

        if (inputFiles == undefined || inputFiles.length == 0) {
            return;
        }

        for (var i = 0; i < fileLength; i++) {
            var inputFile = inputFiles[i];

            if (!FileReader) {
                alert('Ваш браузер не поддерживает загрузку фотографий.');
                return;
            }

            var reader = new FileReader();
            reader.onload = function (event) {
                thisInput.removeClass('error')
                thisParent.css({
                    backgroundImage: 'url(' + event.target.result + ')'
                }).removeClass('error');
                // console.log(thisInput.val());
                thisParent.find('.file-space__change').fadeIn(100).siblings('.file-space__text').hide(0);
                // $lastPreviewBlock.children('.remove-image').on('click', removeButtonHandler);
            };

            reader.onerror = function (event) {
                alert("ERROR: " + event.target.error.code);
            };

            reader.readAsDataURL(inputFile);
        }
    });



    $('form').submit(function(e) {
        e.preventDefault();

        var inputEl = $(this).find('input'),
        emptyInpArr = [];

        inputEl.each(function(index, item) {

            if ($(item).val().length == 0 && $(item).attr('name') != 'insta') {
            
                var emptyInput  = $(item).val('');
                
                emptyInput.addClass('error').parent('.file-space').addClass('error');
                $(this).siblings('.input__dropdown').find('.drop-current').addClass('error')
                emptyInpArr.push(emptyInput.attr('placeholder'));

                $('.form__response').fadeIn(300).html('Обязательные поля "<u>'+ emptyInpArr.join(', ') + '"</u> не выбраны или незаполнены');

                $(this).on('input change', function() {

                    if ($(this).val().length > 0) {
                        $(this).removeClass('error');
                        emptyInpArr.remove($(item).attr('placeholder'));
                    } else {
                        $(this).addClass('error');
                        emptyInpArr.push(emptyInput.attr('placeholder'));
                        
                        $('.form__response').fadeIn(300).html('Обязательные поля "<u>'+ emptyInpArr.join(', ') + '"</u> не выбраны или незаполнены');
                    }

                    if (emptyInpArr.length == 0) {
                        $('.form__response').hide(300);
                    } else {
                        $('.form__response').fadeIn(300).html('Обязательные поля "<u>'+ emptyInpArr.join(', ') + '"</u> не выбраны или незаполнены');
                    }
                });

            } else {
                $(this).removeClass('error').parent('.file-space').removeClass('error');
                $(this).siblings('.input__dropdown').find('.drop-current').removeClass('error')
            }
            
        })

        if (emptyInpArr.length == 0) {
            var formData = new FormData(this);
            $.ajax({ 
                type: "POST", 
                url: "send.php",
                data: formData,
                cache: false,
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                beforeSend: function name(response) {
                    $('.form__loading').fadeIn(300);
                    $('form').find('.btn').attr('disabled', 'disabled');
                },
                success: function (response) {
                    console.log('sent ok');
                    // console.log(response);

                    $('.form__response').fadeIn(100).text('Заявка отправлена. С Вами свяжутся в ближайшее время');

                    $('.form__loading').fadeOut(0);
                    $('form').find('.btn').removeAttr('disabled');

                    setTimeout(function () {
                        $('.form__response').fadeOut(300)
                    }, 4000);

                    inputEl.each(function(index, item) {
                        $(item).val('');
                    })
                    $('.file-space').removeAttr('style').find('.file-space__change').fadeOut(0).siblings('.file-space__text').fadeIn(100);

                    $('.contact__response').fadeIn();
                    $('.contact__area').hide(0);

                },
                error: function (data) {
                    console.log('sent nOk');
                    $('.form__loading').fadeOut(0);
                    $('form').find('.btn').removeAttr('disabled');
                    $('.form__response').fadeIn(100).text('Что-то не так ... попробуйте позже');

                    $('.contact__response').fadeIn();
                    $('.contact__area').hide(0);
                }
            })
        };



    })
    
    $("#phone").mask("+7 (999) 999-99-99");

    $.get("https://api.sypexgeo.net/", function (response) {
        $('#city').val(response.city.name_ru);
        // console.log(response);
    }, "json");

})