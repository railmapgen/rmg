function initDesignPanel() {
    var themeCitySelect = new mdc.select.MDCSelect($('#theme_city')[0]);
    var themeLineSelect = new mdc.select.MDCSelect($('#theme_line')[0]);
    // var themeColourSelect = new mdc.textField.MDCTextField($('#theme_colour')[0]);
    $.getJSON('data/city_list.json', function(data) {
        data.forEach(function(c) {
            $('#theme_city > select').append(
                `<option value="${c.id}">${c.name[0]}</option>`
            );
        });

        var [themeCity, themeLine, themeColour] = getParams().theme
        var cityIdx = $(`#theme_city > select > [value="${themeCity}"]`).index();
        themeCitySelect.selectedIndex = cityIdx;
    });

    themeCitySelect.listen("MDCSelect:change", (event) => {
        $('#theme_line > select').empty();

        if (event.detail.value == 'nullcity') {
            //
        } else {
            $.getJSON(`data/${event.detail.value}.json`, data => {
                data.forEach(l => {
                    $('#theme_line > select').append(
                        `<option value="${l.id}">${l.name[0]}</option>`
                    );
                });

                var param_instance = getParams();
                var themeLine = param_instance.theme[1];
                var lineIdx = $(`#theme_line > select > [value="${themeLine}"]`).index();

                if (lineIdx == -1) {
                    themeLineSelect.selectedIndex = 0;
                } else {
                    themeLineSelect.selectedIndex = lineIdx;
                }

                param_instance.theme[0] = event.detail.value;
                putParams(param_instance);
            });
        }
    });

    themeLineSelect.listen("MDCSelect:change", event => {
        if (themeCitySelect.value == 'nullcity') {
            //
        } else {
            $.getJSON(`data/${themeCitySelect.value}.json`, (data) => {
                var theme = data[event.detail.index];

                ktl.themeLine = theme.id;
                ktl.themeColour = theme.colour;
                // ktl.fillThemeColour();

                var param_instance = getParams();
                param_instance.theme[1] = theme.id;
                // param_instance.theme[2] = theme.colour;
                putParams(param_instance);
            })
        }
    });

    var directionLToggle = new mdc.iconButton.MDCIconButtonToggle($('#direction_l')[0]);
    var directionRToggle = new mdc.iconButton.MDCIconButtonToggle($('#direction_r')[0]);
    directionLToggle.unbounded = true;
    directionRToggle.unbounded = true;
    if (getParams().direction == 'l') {
        directionLToggle.on = true;
        directionRToggle.on = false;
        $('#direction_l').prop('disabled', true);
    } else {
        directionLToggle.on = false;
        directionRToggle.on = true;
        $('#direction_r').prop('disabled', true);
    }
    directionRToggle.listen('MDCIconButtonToggle:change', event => {
        if (event.detail.isOn) {
            ktl.direction = 'r';
            directionLToggle.on = false;
            $('#direction_r').prop('disabled', true);
            $('#direction_l').prop('disabled', false);
        }
    })
    directionLToggle.listen('MDCIconButtonToggle:change', event => {
        if (event.detail.isOn) {
            ktl.direction = 'l';
            directionRToggle.on = false;
            $('#direction_l').prop('disabled', true);
            $('#direction_r').prop('disabled', false);
        }
    })

    var platformTextField = new mdc.textField.MDCTextField($('#platform_num')[0]);
    platformTextField.value = getParams().platform_num;
    $('#platform_num > input').on('input', event => {
        ktl.platformNum = event.target.value;
    });
}