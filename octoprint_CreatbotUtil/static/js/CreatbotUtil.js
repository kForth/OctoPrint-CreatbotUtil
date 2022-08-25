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
    self.printerProfiles = parameters[1];

    self.sendStartStopCommands = ko.observable(undefined);
    self.startStopOnPause = ko.observable(undefined);
    self.replaceHeatedChamberCommand = ko.observable(undefined);
    self.profileMode = ko.observable(undefined);
    self.selectedProfiles = ko.observableArray([]);

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
    dependencies: ["settingsViewModel", "printerProfilesViewModel"],
    elements: [
      "#settings_plugin_CreatbotUtil",
    ]
  });
});
