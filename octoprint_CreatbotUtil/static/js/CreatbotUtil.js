/*
 * View model for OctoPrint-CreatbotUtil
 *
 * Author: Kestin Goforth
 * License: AGPLv3
 */
$(function () {
  function CreatbotUtilViewModel(parameters) {
    var self = this;

    self.settings = parameters[0];

    self.initializeSettings = function (){
      // Callback function to enable/disable profile list based on radio buttons.
      self.onProfileModeChange = function () {
        let val = $("input[name='creatbotUtilProfileModeGroup']:checked").val();
        $("#creatbot-util-profile-list").attr('disabled', val == "ALL");
      };
      $("#creatbot-util-profile-mode").on('change', self.onProfileModeChange);
  
      // Enable/Disable the profile list when the settings page is opened.
      $("#settings_plugin_CreatbotUtil_link").on('click', self.onProfileModeChange);
    };

    self.initializeSettings();
  }

  /* view model class, parameters for constructor, container to bind to
   * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
   * and a full list of the available options.
   */
  OCTOPRINT_VIEWMODELS.push({
    construct: CreatbotUtilViewModel,
    dependencies: ["settingsViewModel"],
    elements: []
  });
});
