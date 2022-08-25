/*
 * View model for OctoPrint-CreatbotUtil
 *
 * Author: Kestin Goforth
 * License: AGPLv3
 */
$(function () {
    function CreatbotUtilViewModel(parameters) {
        var self = this;

        self.settingsView = parameters[0];
        self.loginState = parameters[1];
        self.printerProfiles = parameters[2];
        self.printerState = parameters[3];
        self.access = parameters[4];

        self.sendStartStopCommands = ko.observable(undefined);
        self.startStopOnPause = ko.observable(undefined);
        self.replaceHeatedChamberCommand = ko.observable(undefined);
        self.profileMode = ko.observable(undefined);
        self.selectedProfiles = ko.observableArray([]);

        self.extruderFanSpeed = ko.observable(255);
        self.chamberFanSpeed = ko.observable(255);

        // Commands accessible from settings tab

        self.usedTime = ko.observable(undefined);
        self.usedTimeBusy = ko.observable(false);
        self.usedTimeResetter = ko.observable();
        self.sendUsedTimeCommand = function () {
            var time = self.usedTime();
            if (!time) return;

            self.usedTimeBusy(true);
            OctoPrint.control
                .sendGcodeWithParameters("M6008 S%(time)d", {
                    time: _.parseInt(time)
                })
                .done(function () {
                    self.usedTime(undefined);
                })
                .always(function () {
                    self.usedTimeBusy(false);
                });
        };
        self.resetUsedTimeDisplay = function () {
            self.cancelUsedTimeDisplayReset();
            self.usedTimeResetter(
                setTimeout(function () {
                    self.usedTime(undefined);
                    self.usedTimeResetter(undefined);
                }, 5000)
            );
        };
        self.cancelUsedTimeDisplayReset = function () {
            var resetter = self.usedTimeResetter();
            if (resetter) {
                clearTimeout(resetter);
                self.usedTimeResetter(undefined);
            }
        };

        self.regTime = ko.observable(undefined);
        self.regTimeBusy = ko.observable(false);
        self.regTimeResetter = ko.observable();
        self.sendRegTimeCommand = function () {
            var time = self.regTime();
            if (!time) return;

            self.regTimeBusy(true);
            OctoPrint.control
                .sendGcodeWithParameters("M6009 S%(time)d", {
                    time: _.parseInt(time)
                })
                .done(function () {
                    self.regTime(undefined);
                })
                .always(function () {
                    self.regTimeBusy(false);
                });
        };
        self.resetRegTimeDisplay = function () {
            self.cancelRegTimeDisplayReset();
            self.regTimeResetter(
                setTimeout(function () {
                    self.regTime(undefined);
                    self.regTimeResetter(undefined);
                }, 5000)
            );
        };
        self.cancelRegTimeDisplayReset = function () {
            var resetter = self.regTimeResetter();
            if (resetter) {
                clearTimeout(resetter);
                self.regTimeResetter(undefined);
            }
        };

        // Control tab injection

        self.initializeControls = function () {
            function getInfoIcon() {
                var binding = _.sprintf(
                    'popover: {placement: "%(placement)s", trigger: "%(trigger)s", title: "%(title)s", content: "%(content)s"}',
                    {
                        placement: "top",
                        trigger: "hover",
                        title: gettext("Please note!"),
                        content: gettext(
                            "This setting can only be set, it cannot be read back from the firmware due to a limitation of the communication protocol. There is no way to show the current setting."
                        )
                    }
                );
                return $('<a class="text-info" href="javascript:void(0)">')
                    .append('<i class="fas fa-info-circle">')
                    .attr("data-bind", binding);
            }

            function getSlider(bindValue, min, max) {
                var binding = _.sprintf(
                    "slider: {min: %(min)d, max: %(max)d, value: %(value)s}",
                    {
                        min: min !== undefined ? min : 0,
                        max: max !== undefined ? max : 255,
                        value: bindValue
                    }
                );
                return $('<div class="slider slider-horizontal">').append(
                    $(
                        '<div class="slider-track">' +
                            '<div class="slider-selection" style="left: 0%; width: 100%;"></div>' +
                            '<div class="slider-handle round" style="left: 100%;"></div>' +
                            '<div class="slider-handle round hide" style="left: 0%;"></div>' +
                            "</div>"
                    ),
                    $(
                        '<div class="tooltip top" style="top: -24px; left: -5px;">' +
                            '<div class="tooltip-arrow"></div>' +
                            '<div class="tooltip-inner">' +
                            max +
                            "</div>" +
                            "</div>"
                    ),
                    $('<input type="number" style="width: 100px; display: none;">').attr(
                        "data-bind",
                        binding
                    )
                );
            }

            var controlDiv = $("<div>")
                .attr("id", "control-CreatbotUtil")
                .attr(
                    "data-bind",
                    "visible: loginState.hasPermissionKo(access.permissions.CONTROL)"
                )
                .append(
                    $("<h1>").text(gettext("CreatBot Util")),
                    $("<div>")
                        .addClass("jog-panel")
                        .append(
                            $("<div>").append(
                                $("<label>")
                                    .text(gettext("Extruder Fan Speed: "))
                                    .append(getInfoIcon()),
                                getSlider("extruderFanSpeed"),
                                $('<div class="button-group">').append(
                                    $('<button class="btn btn-small" disabled="">')
                                        .attr(
                                            "data-bind",
                                            "enable: printerState.isOperational(), click: setExtruderFanSpeed"
                                        )
                                        .text(gettext("Set")),
                                    $('<button class="btn btn-small" disabled="">')
                                        .attr(
                                            "data-bind",
                                            "enable: printerState.isOperational(), click: disableExtruderFan"
                                        )
                                        .text(gettext("Disable"))
                                )
                            ),
                            $("<div>").append(
                                $("<label>")
                                    .text(gettext("Chamber Fan Speed: "))
                                    .append(getInfoIcon()),
                                getSlider("chamberFanSpeed"),
                                $('<div class="button-group">').append(
                                    $('<button class="btn btn-small" disabled="">')
                                        .attr(
                                            "data-bind",
                                            "enable: printerState.isOperational(), click: setChamberFanSpeed"
                                        )
                                        .text(gettext("Set")),
                                    $('<button class="btn btn-small" disabled="">')
                                        .attr(
                                            "data-bind",
                                            "enable: printerState.isOperational(), click: disableChamberFan"
                                        )
                                        .text(gettext("Disable"))
                                )
                            )
                        ),
                    "<div style='clear: both'></div>"
                );

            // var neighbor = $("#control-jog-general");
            // controlDiv.insertAfter(neighbor);
            $("#control-jog-custom").append(controlDiv);
        };

        self.setExtruderFanSpeed = function () {
            var speed = _.parseInt(self.extruderFanSpeed());
            if (speed !== NaN) {
                OctoPrint.control.sendGcodeWithParameters("M6011 S%(speed)d", {
                    speed: speed
                });
            }
        };

        self.disableExtruderFan = function () {
            OctoPrint.control.sendGcode("M6011 S0");
        };

        self.setChamberFanSpeed = function () {
            var speed = _.parseInt(self.chamberFanSpeed());
            if (speed !== NaN) {
                OctoPrint.control.sendGcodeWithParameters("M6012 S%(speed)d", {
                    speed: speed
                });
            }
        };

        self.disableChamberFan = function () {
            OctoPrint.control.sendGcode("M6012 S0");
        };

        self.onBeforeBinding = function () {
            self.initializeControls();

            var s = self.settingsView.settings.plugins.CreatbotUtil;
            self.sendStartStopCommands(s.sendStartStopCommands());
            self.startStopOnPause(s.startStopOnPause());
            self.replaceHeatedChamberCommand(s.replaceHeatedChamberCommand());
            self.profileMode(s.profileMode());
            self.selectedProfiles(s.selectedProfiles());
        };
    }

    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
        construct: CreatbotUtilViewModel,
        dependencies: [
            "settingsViewModel",
            "loginStateViewModel",
            "printerProfilesViewModel",
            "printerStateViewModel",
            "accessViewModel"
        ],
        elements: ["#settings_plugin_CreatbotUtil", "#control-CreatbotUtil"]
    });
});
