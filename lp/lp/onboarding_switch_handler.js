!(function () {
    var $buttonHintsSwitch = $(".js-hints-switch");
    var $buttonHintsReset = $('.js-hints-reset');
    var that;

    function hasHintsSwitchOnPage() {
        return $buttonHintsSwitch.length;
    }

    function init() {
        $buttonHintsSwitch.on('click', hintsSwitchAction);
        $buttonHintsReset.on('click', hintsResetAction);
    }

    /**
     * Включает отображение подсказок
     */
    function turnOnHints() {
        $.post(
            window.baseUrl + 'profile/ajax/frm:turnOnHints',
            {},
            function (resp) {
                if (resp.res == 1) {
                    lockScreen('Загрузка...');
                    window.location.href = window.location.href;
                } else {
                    jAlert(resp.err);
                }
            },
            'json'
        );
    }

    /**
     * Отключает отображение подсказок
     */
    function turnOffHints() {
        window.lpm_hints.getHintsManager().removeAll();
        $.post(
            window.baseUrl + 'profile/ajax/frm:turnOffHints',
            {},
            function (resp) {
                if (resp.res == 1) {
                    return;
                } else {
                    jAlert(resp.err);
                }
            },
            'json'
        );
    }

    /**
     * Сбрасывает все просмотренные подсказки
     */
    function resetHints() {
        $.post(
            window.baseUrl + 'profile/ajax/frm:resetHints',
            {
                location: that.location
            },
            function (resp) {
                if (resp.res == 1) {
                    switchOn();
                    lockScreen('Загрузка...');
                    window.location.href = window.location.href;
                } else {
                    jAlert(resp.err);
                }
            },
            'json'
        );
    }

    function hintsSwitchAction() {
        var isOn = $buttonHintsSwitch.hasClass('on');

        if (isOn) {
            $buttonHintsSwitch.removeClass('on').addClass('off');
            turnOffHints();
        } else {
            switchOn();
            turnOnHints();
        }
    }

    function switchOn() {
        $buttonHintsSwitch.removeClass('off').addClass('on');
    }

    function hintsResetAction() {
        resetHints();
        return false;
    }

    if (hasHintsSwitchOnPage()) {
        init();
    }

    FE.run('onboardingSwitchReady');

    that = window.__onboardingSwitchHandler = {
        location: 'pages/edit',
        $switchEl: $buttonHintsSwitch
    };
})();