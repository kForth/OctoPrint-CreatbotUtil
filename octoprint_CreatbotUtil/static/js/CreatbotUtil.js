/*
 * View model for OctoPrint-CreatbotUtil
 *
 * Author: Kestin Goforth
 * License: AGPLv3
 */
$(function() {
    function CreatbotUtilViewModel(parameters) {
      var self = this;
  
      self.settingsViewModel = parameters[0];
      self.printerStateViewModel = parameters[1];
      self.version = undefined;

      self.profile_list = [];
    }
  
    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
      construct: CreatbotUtilViewModel,
      dependencies: [/*"settingsViewModel"*/],
      elements: [/*"#settings_plugin_CreatbotUtil"*/]
    });
  });
  