!(function () {

    var emptySettings = {
        name: '',
        title: '',
        hintBody: '',
        btnText: '',
        description: '',
        hintClasses: '',

    }
        , getDefaultSettings = function () {
            return {
                generalSelector: '',
                removeEvent: 'mousedown',
                name: '',
                hintId: null,
                runEventAfterHintRead: {
                    eventName: null,
                    element: null
                },
                runEventAfterMaskClick: {
                    eventName: null,
                    element: null
                },
                runOn: '',
                position: 'top',
                cornerPosition: 'center',
                stopEvent: false,
                tinyMargin: 4
            };
        }
        , htmlBuilder = new HintHtmlBuilder()
        , hintsManager = new HintsManager()
        , maskManager = new MaskManager()
        ;

    maskManager.appendMaskHTMLToBody();
    maskManager.findMasks();
    maskManager.initEvents();


    function HintsManager () {
        this.currentDisplayedHint = {};
        this.stashedHints = {};
        this.activeHints = {};

        this.stashHint = function (hintObj) {
            var hintName = hintObj.settings.name;
            //копируем объект переданной подсказки в свойство спрятанных подсказок
            this.stashedHints[hintName] = $.extend(true, {}, hintObj);
        };

        this.hintIsAlreadyShow = function (hintToShow) {
            if (!$.isEmptyObject(this.currentDisplayedHint)) {
                if (this.currentDisplayedHint.settings.name == hintToShow.settings.name) {
                    return true;
                }
            }
            return false;
        };
        
        this.addToActiveHints = function (hintInstance) {
            this.activeHints[hintInstance.settings.name] = hintInstance;
        };

        this.offHint = function (hintInstance) {
            if (hintInstance) {
                var hintName = hintInstance.settings.name;
                this.markHintAsRead(hintName);
                maskManager.hideMask();
                $(document).off('._' + hintName);
                this.remove(hintName);
                delete this.stashedHints[hintName];
            }
        }


        /**
         * Удаление подсказки из списка активных подсказок
         * @param name
         */
        this.remove = function (name) {
            if (this.activeHints[name]) {
                if (this.activeHints[name].$eventElement instanceof jQuery) {
                    this.activeHints[name].$eventElement.removeClass('onboarding_' + name);
                }
                this.activeHints[name].$hintEl.remove();
                delete this.activeHints[name];
            }
        };


        this.checkHintsCount = function () {
            if ($.isEmptyObject(this.activeHints) && __onboardingSwitchHandler.$switchEl.length) {
                __onboardingSwitchHandler.$switchEl.removeClass('on').addClass('off');
            }
        };

        this.removeAll = function () {
            var i;
            for (i in this.activeHints) {
                this.remove(i);
            }
        };


        /**
         * Запрос на запись в БД о том, что подсказка была прочтена
         * @param hintName
         */
        this.markHintAsRead = function (hintName) {
            $.post(
                window.baseUrl + '/profile/ajax/frm:hintReaded',
                {
                    hintName: hintName
                },
                function (resp) {
                    if( resp.res == 1 ){
                        return;
                    } else {
                        jAlert(resp.err)
                    }
                },
                'json'
            )
        }
    }


    /**
     * Конструктор макси (затемнения фона и выделения необходимого источника)
     * @constructor
     */
    function MaskManager () {
        var that = this;

        this.findMasks = function () {
            this.mask_wrap = $("#conceal_mask_wrap");
            this.all_masks = this.mask_wrap.find(".conceal_mask");

            this.masks = {
                top: this.mask_wrap.find('.top'),
                left: this.mask_wrap.find('.left'),
                right: this.mask_wrap.find('.right'),
                bottom: this.mask_wrap.find('.bottom')
            };
        };

        this.showing_el = {};
        this.isMasksShow = false;

        this.hideMaskDeferred = $.Deferred();
        this.hideMaskDeferred.resolve();

        /**
         *  регистрирует данные о элементе, который необходимо выделить
         * @param el
         */
        this.registerElement = function (el) {
            var offset = el.offset(),
                sh_el = this.showing_el;
            sh_el.width = el.outerWidth();
            sh_el.height = el.outerHeight();
            sh_el.offset_right = ($(window).width() - (offset.left  + sh_el.width));
            sh_el.offset_bottom = ($(window).height() - (offset.top + sh_el.height));
            sh_el.offset_top = offset.top;
            sh_el.offset_left = offset.left;
        };

        /**
         * Выделение элемента
         * Как примерно это выглядит:
         *  ______________________________________________________________
         * |//////////////////////////////////////////////////////////////|
         * |//////////////////////////////////////////////////////////////|
         * |////////////////////////TOP MASK//////////////////////////////|
         * |//////////////////////////////////////////////////////////////|
         * |--------------------------------------------------------------|
         * |/////////////|                         |//////////////////////|
         * |////LEFT/////|          ELEMENT        |////////RIGHT/////////|
         * |/////////////|                         |//////////////////////|
         * |-------------|_________________________|----------------------|
         * |//////////////////////////////////////////////////////////////|
         * |//////////////////////////BOTTOM//////////////////////////////|
         * |//////////////////////////////////////////////////////////////|
         *
         */
        this.showElement = function (margin) {
            var showning_el = this.showing_el,
                tinyMargin = margin;
            this.masks.top.css({height: showning_el.offset_top - tinyMargin});
            this.masks.left.css({top: showning_el.offset_top - tinyMargin, width: showning_el.offset_left - tinyMargin, height: showning_el.height + tinyMargin * 2});
            this.masks.right.css({top: showning_el.offset_top - tinyMargin, width: showning_el.offset_right - tinyMargin, height: showning_el.height + tinyMargin * 2});
            this.masks.bottom.css({height: showning_el.offset_bottom - tinyMargin});

            this.mask_wrap.show();
            this.all_masks.fadeIn('slow');
            this.isMasksShow = true;
            this.hideMaskDeferred = $.Deferred();
        };

        /**
         * Скрытие масок ( тот случай , когда маски полностью прозрачны и по клику по ним нужно скрыть подсказку )
         */
        this.hideMask = function (ops) {
            if (this.isMasksShow == false ) {
                return;
            }

            var options = $.extend({}, ops);
            //берём объект с текущей отображаемой подсказкой
            var displayed_hint = hintsManager.currentDisplayedHint;

            $.when(that.all_masks.fadeOut('slow')).then(function () {
                that.mask_wrap.hide();
                if (options.wasClickOnMask) {
                    displayed_hint.runEventOnMaskClick();
                }
                that.hideMaskDeferred.resolve();
            });

            if (options.removeHint) {
                hintsManager.stashHint(displayed_hint);
                displayed_hint.$hintEl.fadeOut('slow', function () {
                    hintsManager.remove(displayed_hint.settings.name);
                });
            }
            this.isMasksShow = false;
            hintsManager.currentDisplayedHint = false;
        };


        this.initEvents = function () {
            this.all_masks.on('click', function () {
                that.hideMask({removeHint: true, wasClickOnMask: true});
            });
        }

        this.appendMaskHTMLToBody = function () {
            var maskHtml =
                $('<div id="conceal_mask_wrap" >' +
                    '<div class="conceal_mask top"></div>' +
                    '<div class="conceal_mask left"></div>' +
                    '<div class="conceal_mask right"></div>' +
                    '<div class="conceal_mask bottom"></div>' +
                    '</div>');
            $('body').append(maskHtml);
        };

    }



    function HintHtmlBuilder () {
        this.buildHintBody = function () {
            var html = this.html;
            return strtr(html.wrap,{
                ':STYLE': html.style,
                ':BODY': html.title + html.text + html.description + html.footer + html.corner + html.special
            })
        };

        this.getDefaultText = function () {
            return {
                title: '',
                text: '',
                description : '',
                button: 'Понятно',
                wrap_class: '',
            }
        };

        this.getDefaultHtml = function () {
            return {
                wrap:
                '<div class="tour_popover :WRAP_CLASS hidden " style=":STYLE">' +
                ':BODY' +
                '</div>',

                title: '<div class="tp_caption no_sel" style="display: none">:TITLE</div>',
                text: '<div class="tp_text no_sel">:TEXT</div>',
                description: '<div class="tp_descr">:DESCRIPTION</div>',
                button: '<button class="btn btn-primary btn-round hint_readed">:BUTTON</button>',
                footer:
                '<div class="tp_footer c_text clearfix ">' +
                '<div class="c_text ">'+
                ':BUTTON_HTML' +
                '</div>' +
                '</div>',
                corner: '<div class="tp_corner "></div>',
                style: '',
                special: ''
            }
        }


        this.buildHintFooter = function () {
            this.html.footer = strtr(this.html.footer, {
                ':BUTTON_HTML': this.html.button
            });
        };

        this.prepareText = function () {
            var preparedTextObject =  {};

            for (var textKey in this.text) {
                var preparedKeyName = ':' + textKey;
                preparedTextObject[preparedKeyName.toUpperCase()] = this.text[textKey];
            }
            return preparedTextObject;
        };

        this.buildHint = function () {
            this.text = $.extend(this.getDefaultText(), this.text);
            this.html = $.extend(this.getDefaultHtml(), this.html);
            this.buildHintFooter();

            var hint = this.buildHintBody(),
                text = this.prepareText();

            return $(strtr(hint, text));

        };
    }

    function Hint () {
        this.initHint = function (){
            try {
                this.checkHint();
            } catch (exception) {
                if (this.sayAboutEx) {
                    consoleDbg('подсказка ' + this.settings.name + ' не была инициализирована по причине: ' + exception.message);
                }
                return;
            }
            this.settings = $.extend(getDefaultSettings(), this.settings);

            this.initHtmlBuilder(htmlBuilder);
            this.$hintEl = this.htmlBuilder.buildHint();
            this.$btnEl = this.findButton();
            this.addEventListenerToHintBtn();
            this.$eventElement = this.setEventElement();
            this.addEventListenerToEventElement(this);
            //Вставляем в боди скрытую подсказку, чтобы можно было определить её размеры
            this.registerHintSizes();
            this.addToQueue();
            hintsManager.addToActiveHints(this);
            FE.run('onHintInitialized', {hintInstance: this});
        };

        this.sayAboutEx = 0;

        this.initHtmlBuilder = function (htmlBuilder) {
            alert('Builder not installed!')
        };

        this.runHintShowEvent = function (itemToShow) {
            FE.run(this.settings.runOn, itemToShow);
        };

        this.changeHintText = function (text) {
            this.$hintEl.find(".tp_text").text(text);
        };


        this.addToQueue = function () {
            if (this.settings.runOn == 'pages_editor/ready') {
                //то сразу же и отрисовывем её
                this.draw();
            } else {
                //иначе добавляем подсказку в очередь
                FE.add(this.settings.runOn, this.draw.bind(this))
            }
        }


        this.draw = function () {
            var hintSettings = this.settings;


            //если подсказка уже отображается
            if (hintsManager.hintIsAlreadyShow(this)) {
                //то выходим
                return;
            }
            //Если к нам пришёл jquery объект в момент вызова функции-отрисовки (т.е. элемент-источник является динамичным, его невозможно отследить в момент отрисовки редактора)
            if (arguments[0] instanceof jQuery) {
                //то вешаем на него класс, который делает его видимым (например, чтобы избежать тот случай, когда элемент-источник видим только в случае hover'a(Шестерёнка секции нового дизайна и пр.))
                arguments[0].addClass('onboarding_' + hintSettings.name);
                //и регстрируем данный элемент в объекте подсказке
                this.$eventElement = this.registerElementData(arguments[0]);
            }
            this.setHintPosition();
            this.setHintCorner();
            //that.initSourceElementClick();
            maskManager.registerElement($(this.$eventElement));
            $.when(maskManager.hideMaskDeferred).done(function () {
                maskManager.showElement(hintSettings.tinyMargin);
            });
            //Убираем слушателя (из addListenerToRemoveHint() )
            //$(document).off('click._'+that.options.name);
            //помечаем текущую отображаемую подсказку
            hintsManager.currentDisplayedHint = this;
            this.$hintEl.removeClass('hidden');
        };
        
        
        this.runEventOnMaskClick = function () {
            //получаем опцию того, какой эвент запустить после прочтения подсказки
            var runAfterClick = this.settings.runEventAfterMaskClick;
            //проверяем, надо ли запустить эвент после того, как скрылась маска(и только)
            if (runAfterClick.eventName) {
                //если надо - то запускаем
                FE.run(runAfterClick.eventName, $(runAfterClick.element));
            }
        }


        this.getSettings = function () {
            alert('Settings not installed!')
        };

        this.onHintRead = function () {
            if (this.settings.runEventAfterHintRead.eventName) {
                FE.run(this.settings.runEventAfterHintRead.eventName, $(this.settings.runEventAfterHintRead.element));
            }
        }

        /**
         * Запрос на запись в БД о том, что подсказка была прочтена
         * @param hint_id
         */
        this.markHintAsRead = function (hintName) {
            hintsManager.markHintAsRead(hintName)
        }

        this.addEventListenerToHintBtn = function () {
            var hintInstance = this
                ,hintSettings = hintInstance.settings;

            if (this.$btnEl.length) {
                this.$btnEl.on('click', function () {
                    hintInstance.markHintAsRead(hintSettings.name);
                    hintsManager.checkHintsCount();
                    maskManager.hideMask();

                    //дожидаемся резолва от маски
                    $.when(maskManager.hideMaskDeferred).done(function () {
                        hintInstance.onHintRead();
                    });

                    hintsManager.remove(hintSettings.name);
                    //также удаляется спрятанная подсказка (вдруг юзер нажал на скрытие маски, а потом нажал на элемент, относящийся к подсказке)
                    delete hintsManager.stashedHints[hintSettings.name];
                    $(document).off('._' + hintSettings.name)
                })
            }
        }

        this.registerHintSizes = function () {
            //Вставляем в боди скрытую подсказку, чтобы можно было определить её размеры
            var hint = this.$hintEl;
            $('body').append(hint);
            var sizes = {
                width: hint.outerWidth(),
                height: hint.outerHeight(),
                half_width: hint.outerWidth() / 2,
                half_height: hint.outerHeight() / 2
            };
            hint.data('hint_sizes', sizes);
            return this.$hintEl;
        }

        this.setEventElement = function () {
            alert('element not installed!')
        };

        this.registerElementData = function (el) {
            var $el = $(el),
                offset = $el.offset(),
                data = {
                    left: offset.left,
                    top: offset.top,
                    width: $el.outerWidth(),
                    height: $el.outerHeight()
                };

            $el.data('el_data', data);
            return $el;
        };


        this.findButton = function () {
            if (this.htmlBuilder.text.button) {
                return this.$hintEl.find('button');
            }
        };

        this.removeEventListeners = {

            //byGeneralSelector: function (hintInstance) {
            //    var hintSettings = hintInstance.settings;
            //    $(document).on( hintSettings.removeEvent + '._' + hintSettings.name, hintSettings.generalSelector, function (e) {
            //        hintsManager.markHintAsRead(hintSettings.name);
            //        hintsManager.remove(hintSettings.name);
            //        $(document).off('._' + hintSettings.name);
            //        maskManager.hideMask();
            //        hintsManager.checkHintsCount();
            //    })
            //},

            byMainSelector: function (hintInstance) {
                var hintSettings = hintInstance.settings
                    , elementToListen = hintSettings.generalSelector ? hintSettings.generalSelector : hintInstance.$eventElement;

                $(document).on( hintSettings.removeEvent + '._' + hintSettings.name, $(elementToListen).selector, function (e) {
                    if (hintSettings.stopEvent) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    hintsManager.markHintAsRead(hintSettings.name);
                    hintsManager.remove(hintSettings.name);
                    $(document).off('._' + hintSettings.name);
                    maskManager.hideMask();
                    hintInstance.onHintRead();
                    hintsManager.checkHintsCount();
                });
            }

            //byMainSelector: function () {
            //    var hintInstance = this;
            //    $(document).on( hintInstance.settings.removeEvent + '._' + hintInstance.settings.name, $(hintInstance.$eventElement).selector, function () {
            //        hintsManager.markHintAsRead(hintInstance.settings.name);
            //        hintsManager.remove(hintInstance.settings.name);
            //        $(document).off('._' + hintInstance.settings.name);
            //        maskManager.hideMask();
            //
            //        if (hintInstance.settings.runEventAfterHintRead.eventName) {
            //            hintInstance.runEventAfterHintRead();
            //        }
            //    });
            //}
        };

        this.addEventListenerToEventElement = this.removeEventListeners.byMainSelector;

        this.getHintsManager = function () {
            return hintsManager;
        };

        //this.replace = function (hintHtml, settings) {
        //    return $(strtr(hintHtml, {
        //        ':ID':'onboarding_' + settings.name,
        //        ':TITLE': settings.title,
        //        ':TEXT': settings.hintBody,
        //        ':BTN': settings.btnText,
        //        ':CLS' : settings.hintClasses,
        //        ':DESCR' : description
        //    }));
        //}
        //
        //
        //this.getHtml = function () {
        //    return '<div id=":ID" class="tour_popover :CLS hidden">' +
        //        '<div class="tp_caption no_sel" style="display: none">:TITLE</div>' +
        //        '<div class="tp_text no_sel">:TEXT</div>' +
        //        ':DESCR'+
        //        '<div class="tp_footer c_text clearfix ">' +
        //        '<div class="c_text ">'+
        //        '<button class="btn btn-primary btn-round hint_readed">:BTN</button>' +
        //        '</div>' +
        //        '</div>' +
        //        '<div class="tp_corner "></div>' +
        //        '</div>'
        //}

        this.initRules = null;

        this.ready = function () {
            this.flagIsReady = true;
            FE.runAndClr('lpm_hints/ready')
        };

        this.isReady = function () {
            return this.flagIsReady;
        }

        this.flagIsReady = false;

        this.checkHint = function () {
            if (this.initRules) {

            }

            this.specialCheck();
        };


        this.specialCheck = function () {

        };




        /**
         * Позиционирование подсказки по центру выбранной позиции относительно элемента источника
         *
         *                      _____________
         *                     |             |
         *                     |     TOP     |
         *                     |______  _____|
         *                            \/
         *                  ________________________
         * _____________   |                        |   _____________
         *|             |  |                        |  |             |
         *|     LEFT    >  |         ELEMENT        | <     RIGHT    |
         *|_____________|  |                        |  |_____________|
         *                 |________________________|
         *
         *                      ______/\______
         *                     |              |
         *                     |    BOTTOM    |
         *                     |______________|
         *
         */
        this.setHintPosition = function () {
            var top, left,
                hint_sizes = this.$hintEl.data('hint_sizes'),
                el_data = $(this.$eventElement).data('el_data'),
                top_menu_height = $("#bs_top_menu_wrap").outerHeight(),
            //Место, в которое могла бы поместиться подсказка
                allowed_top_space = el_data.top - top_menu_height + 50;

            //Если была выбрана верхняя позиция, но места для того, чтобы отобразить подсказку мало
            if (this.settings.position == 'top' && hint_sizes.height > allowed_top_space) {
                //то позиционируем подсказку снизу
                this.settings.position = 'bottom';
                //и выставляем уголок подсказки по центру
                this.settings.cornerPosition = 'center';
            }

            switch (this.settings.position) {
                case 'left':
                    top = ( el_data.top + el_data.height / 2 ) - hint_sizes.half_height;
                    left = el_data.left - hint_sizes.width;
                    break;
                case 'right':
                    top = el_data.top + el_data.height / 2 - hint_sizes.half_height;
                    left = el_data.left + el_data.width;
                    break;
                case 'top':
                    top = el_data.top - hint_sizes.height;
                    left = el_data.left + el_data.width / 2 - hint_sizes.half_width;
                    break;
                case 'bottom':
                    top = el_data.top + el_data.height;
                    left = el_data.left + el_data.width / 2 - hint_sizes.half_width;
                    break;
            }

            this.$hintEl.data('position', {
                top: top,
                left: left
            });
            this.$hintEl.css({top: top, left: left});
        };

        /**
         * Позиционирование уголка подсказки
         * Обрати внимание, что, например, при выборе позиции подсказки top  у неё уголок не может быть расположен в bottom (т.к. если подсказка отображается над элементом,
         * то уголок у неё может быть только слева, по центру или справа )
         *          _____________
         *         |             |
         *         |    HINT     |
         *         |  ___  ____  |
         *         \/    \/    \/ <--- corner(уголок)
         *    _______________________
         *   |                       |
         *   |        ELEMENT        |
         *   |                       |
         *   |_______________________|
         *
         */
        this.setHintCorner = function () {
            var hint_el = this.$hintEl,
                hint_sizes = hint_el.data('hint_sizes'),
                hint_position = hint_el.data('position'),
                corner = hint_el.find('.tp_corner').css({left:'', top:'', bottom: '', right: ''}),
                corner_pos, unchangable;

            switch(this.settings.position) {
                case 'left':
                    //не изменяемое
                    unchangable = {
                        hint: {left: hint_position.left - 15},
                        corner: {right: 0}
                    };
                    corner_pos = {
                        top: {
                            hint: {top: hint_position.top + hint_sizes.half_height - 22},
                            corner: {top: 22}
                        },
                        center: {
                            hint: {},
                            corner: {top: hint_sizes.half_height}
                        },
                        bottom: {
                            hint: {top: hint_position.top - hint_sizes.half_height + 22},
                            corner: {bottom: 22}
                        }
                    };
                    break;

                case 'top':
                    unchangable = {
                        hint: {top: hint_position.top - 15},
                        corner: {bottom: 0}
                    };
                    corner_pos = {
                        left: {
                            hint: {left: hint_position.left + hint_sizes.half_width - 44},
                            corner: {left: 44}
                        },
                        center: {
                            hint: {},
                            corner: {left: hint_sizes.half_width}
                        },
                        right: {
                            hint: {left: hint_position.left - hint_sizes.half_width + 44},
                            corner: {right: 44}
                        }
                    };
                    break;

                case 'right':
                    unchangable = {
                        hint: {left: hint_position.left + 15 },
                        corner: {left: 0}
                    };
                    corner_pos = {
                        top: {
                            hint: {top: hint_position.top + hint_sizes.half_height - 22},
                            corner: {top: 22}
                        },
                        center: {
                            hint: {},
                            corner: {top: hint_sizes.half_height}
                        },
                        bottom: {
                            hint: {top: hint_position.top - hint_sizes.half_height + 22},
                            corner: {bottom: 22}
                        }
                    };
                    break;

                case 'bottom':
                    unchangable = {
                        corner: {top: 0},
                        hint: { top: hint_position.top + 15}
                    };
                    corner_pos = {
                        left: {
                            hint: {left: hint_position.left + hint_sizes.half_width - 44},
                            corner: {left: 44}
                        },
                        center: {
                            hint: {},
                            corner: {left: hint_sizes.half_width}
                        },
                        right: {
                            hint: {left: hint_position.left - hint_sizes.half_width + 44},
                            corner: {right: 44}
                        }
                    };
                    break;
            }

            hint_el.css($.extend({}, corner_pos[this.settings.cornerPosition].hint, unchangable.hint));
            corner.css($.extend({}, corner_pos[this.settings.cornerPosition].corner, unchangable.corner));
        };

        this.get = function (hintName) {
            return this.getHintsManager().activeHints[hintName];
        };

        this.getStashed = function (hintName) {
            return this.getHintsManager().stashedHints[hintName];
        }

        this.offHint = function (hintName) {
            var hintInstance = this.get(hintName);
            if (!hintInstance) {
                hintInstance = this.getStashed(hintName)
            }
            hintsManager.offHint(hintInstance);
            hintsManager.checkHintsCount();
        }

    }


    window.lpm_hints = new Hint();
})();