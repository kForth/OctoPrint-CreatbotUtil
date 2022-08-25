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
    
    // Commands accessible from settings tab

    self.usedTime = ko.observable(undefined);
    self.usedTimeBusy = ko.observable(false);
    self.usedTimeResetter = ko.observable();
    self.sendUsedTimeCommand = function () {
        var time = self.usedTime();
        if (!time) return;
        
        self.usedTimeBusy(true);
        OctoPrint.control.
          sendGcodeWithParameters("M6008 S%(time)d", {
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
        OctoPrint.control.
          sendGcodeWithParameters("M6009 S%(time)d", {
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

    self.onBeforeBinding = function () {
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
      "accessViewModel",
    ],
    elements: [
      "#settings_plugin_CreatbotUtil",
    ]
  });
});
