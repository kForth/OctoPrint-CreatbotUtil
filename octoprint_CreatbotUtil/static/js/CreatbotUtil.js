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
    self.tempState = parameters[1];
    self.printState = parameters[2];

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

    self.anyHotendHeating = function() {
      return self.tempState.tools().some(e => e.target() > 0);
		}

    self.onUnloadFilament = function () {
      console.log("Unloading Filament!");
      $.ajax({
        url: API_BASEURL + "plugin/CreatbotUtil",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
          command: "unloadFilament"
        }),
        contentType: "application/json; charset=UTF-8",
        error: function (resp, status) {
          new PNotify({
            title: "Failed to unload filament.",
            text: resp.responseText,
            hide: true,
            buttons: {
              sticker: false,
              closer: true
            },
            type: "error"
          });
        }
      });
    };

    self.initializeFilamentChangeButton = function () {
      self.controlDiv = $('<div>', {
        class: 'row-fluid print-control',
        // 'data-bind': 'visible: settings.plugins.CreatbotUtil.showControls',
        style: 'margin-top: 10px',
      })

      self.unloadButton = $("<button>", {
        // id: 'job_unload',
        text: 'Unload Filament',
        class: 'btn btn-block control-box',
        title: 'Unload filament from the active tool.',
        // 'data-bind': 'enabled: isOperational() && (!isPrinting() || isPaused())',
        // disabled: true,
      }).on('click', self.onUnloadFilament);
        // .append(
        //   $('<i class="fas fa-undo-alt"></i>'),
        //   $('<span> Unload</span>')
        // );
      self.controlDiv.append(self.unloadButton);

      $('#control-jog-general > div').append(self.controlDiv);
    };

    self.initializeControls = function() {
      self.initializeFilamentChangeButton();
    };

    self.updateControls = function () {
      try{
        console.log(self.settings.plugins);
      }
      catch(e){
        console.log(e);
      }
      // self.controlDiv.toggleClass({ hidden: self.settings.settings.plugins.CreatbotUtil.showControls });

      // Disable button if temp is not ready and if we aren't paused or waiting.
      self.unloadButton.attr('disabled', 
        !self.anyHotendHeating() ||
        !(self.printState.isPaused() || self.printState.isReady())
      );
    };

    self.initializeSettings();
    self.initializeControls();
    self.fromCurrentData = self.updateControls;
    self.updateControls();
  }

  /* view model class, parameters for constructor, container to bind to
   * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
   * and a full list of the available options.
   */
  OCTOPRINT_VIEWMODELS.push({
    construct: CreatbotUtilViewModel,
    dependencies: ["settingsViewModel", "temperatureViewModel", "printerStateViewModel"],
    elements: []
  });
});
