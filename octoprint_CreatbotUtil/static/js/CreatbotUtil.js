/*
 * View model for OctoPrint-CreatbotHeatedChamber
 *
 * Author: Kestin Goforth
 * License: AGPLv3
 */
$(function() {
    console.log("Creatbot Start");

    function CreatbotHeatedChamberViewModel(parameters) {
      var self = this;
  
      self.settingsViewModel = parameters[0];
      self.printerStateViewModel = parameters[1];
      self.version = undefined;

        self.ProfileList = [];
    }
  
    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
      construct: CreatbotHeatedChamberViewModel,
      dependencies: ["settingsViewModel"],
      elements: ["#settings_plugin_CreatbotHeatedChamber"]
    });
  });
  