# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
from enum import Enum

import octoprint.plugin
import logging

# GCODE_PAUSE_PRINT =         "M6001"  # Pause print same as M600 but not retracting filament.
# GCODE_RESUME_PRINT =        "M6002" # Resume print from M6001.
# GCODE_UNLOAD_FILAMENT =     "M6003" # Unload filament after detect filament broken
# GCODE_RESUME_ACCIDENT =     "M6004" # Resume print from accident
# GCODE_HOME_AND_RESUME =     "M6005" # Home & Resume print from accident
GCODE_START_SERIAL_PRINT =  "M6006" # Start Serial print
GCODE_STOP_SERIAL_PRINT =   "M6007" # Stop Serial print
# GCODE_SET_USED_TIME =       "M6008" # Set used Time (M6008 S0.00)
# GCODE_SET_REG_SN =          "M6009" # Set regSN (M6009 S0.00)
# GCODE_ADJUST_Z_VAL =        "M6010" # Adjust the Z Value after adjust zprobe_zoffset
# GCODE_SET_TEMP_FAN =        "M6011" # (like M106) Set Temp fan
# GCODE_SET_AIR_FAN =         "M6012" # (like M106) Set Air fan
GCODE_OG_CHAMBER_TEMP =     "M141"  # Original Marlin 'Set Chamber Temp' command
GCODE_SET_CHAMBER_TEMP =    "M6013" # (like M140) Set Chamber Temp.
# GCODE_PROBE_BED =           "M6014" # (include G29) Probe the bed
# GCODE_SD_TO_USB = {
#     # "SD Command": "USB Command"
#     'M20': "M6020", # List USB                                          
#     'M21': "M6021", # Init USB                                          
#     'M22': "M6022", # Release USB                                       
#     'M23': "M6023", # Select USB file                                   
#     'M24': "M6024", # Start/resume USB print                            
#     'M25': "M6025", # Pause USB print                                   
#     'M26': "M6026", # Set USB position in bytes
#     'M27': "M6027", # Report USB print status
#     'M28': "M6028", # Start USB write. (Not Implemented in Firmware)
#     'M29': "M6029", # Stop USB write. (Not Implemented in Firmware)
#     'M30': "M6030", # Delete file from USB. (Not Implemented in Firmware)
#     'M32': "M6032", # Select file and start SD print    
#     # 'M33': "",    # Get Long Path (Not Implemented in Firmware)
#     # 'M34': "",    # SDCard Sorting (Not Implemented in Firmware)
#     'M92': "M6033", # Start USB write (logging) (Not Implemented in Firmware)
# }

class CreatbotUtilProfileModes(Enum):
    ALL = 0
    SELECT = 1

class CreatbotUtilPlugin(octoprint.plugin.EventHandlerPlugin,
                         octoprint.plugin.SettingsPlugin,
                         octoprint.plugin.AssetPlugin,
                         octoprint.plugin.TemplatePlugin):

    def __init__(self):
        self._logger = logging.getLogger(__name__)
        
        # self._replaceSdCommandsWithUsb = True
        # self._sendPauseResumeCommands = True
        self._sendStartStopCommands = True
        self._replaceHeatedChamberCommand = True
        self._profileMode = CreatbotUtilProfileModes.ALL.name
        self._selectedProfiles = []

    def initialize(self):
        # self._replaceSdCommandsWithUsb = self._settings.get_boolean(["replaceSdCommandsWithUsb"])
        # self._sendPauseResumeCommands = self._settings.get_boolean(["sendPauseResumeCommands"])
        self._sendStartStopCommands = self._settings.get_boolean(["sendStartStopCommands"])
        self._replaceHeatedChamberCommand = self._settings.get_boolean(["replaceHeatedChamberCommand"])
        self._profileMode = self._settings.get(["profileMode"])
        self._selectedProfiles = self._settings.get(["selectedProfiles"])

    def _enabled_for_current_profile(self):
        if self._profileMode == CreatbotUtilProfileModes.ALL.name:
            return True
        profile = self._printer_profile_manager.get_current()
        if not profile:
            return False
        profile_id = profile.get('id', False)
        if not profile_id:
            return False
        return profile_id in self._selectedProfiles

    ##~~ AssetPlugin
    def get_assets(self):
        return {
            'js': ["js/CreatbotUtil.js"],
        }

    ##~~ SettingsPlugin
    def get_settings_defaults(self):
        return {
            # "replaceSdCommandsWithUsb": True,
            # "sendPauseResumeCommands": True,
            "sendStartStopCommands": True,
            "replaceHeatedChamberCommand": True,
            "profileMode": CreatbotUtilProfileModes.ALL.name,
            "selectedProfiles": []
        }

    def on_settings_save(self, data):
        octoprint.plugin.SettingsPlugin.on_settings_save(self, data)
        self.initialize()

    ##~~ TemplatePlugin
    def get_template_configs(self):
        return [
            {
                "type": "settings",
                "name": "Creatbot Util",
                "template": "CreatbotUtil_settings.jinja2",
                "custom_bindings": False,
            }
        ]

    # ~~ EventHandlerPlugin hook
    def on_event(self, event, payload):
        if self._enabled_for_current_profile():
            if self._sendStartStopCommands:
                if event == "PrintStarted":
                    self._logger.info("Starting Serial Print")
                    self._printer.commands([GCODE_START_SERIAL_PRINT])
                elif event in ("PrintStopped", "PrintCancelled", "PrintDone"):
                    self._logger.info("Stopping Serial Print")
                    self._printer.commands([GCODE_STOP_SERIAL_PRINT])
        
            # if self._sendPauseResumeCommands:
            #     if event == "PrintPaused":
            #         self._logger.info("Pausing Print")
            #         self._printer.commands([GCODE_PAUSE_PRINT])
            #     if event == "PrintResumed":
            #         self._logger.info("Resuming Print")
            #         self._printer.commands([GCODE_RESUME_PRINT])

    ##~~ Gcode Sending Hook
    def gcode_sending_hook(self, comm_instance, phase, cmd, cmd_type, gcode, *args, **kwargs):
        if gcode and self._enabled_for_current_profile():
            new_gcode = False
            if self._replaceHeatedChamberCommand and gcode == GCODE_OG_CHAMBER_TEMP:
                new_gcode = GCODE_SET_CHAMBER_TEMP
            # if self._replaceSdCommandsWithUsb and gcode in GCODE_SD_TO_USB:
            #     new_gcode = GCODE_SD_TO_USB[gcode]

            if new_gcode:
                cmd = new_gcode + cmd[len(gcode):]
                self._logger.info("Replacing %s command with %s: %s", gcode, new_gcode, cmd)
        return cmd,

    ## Software Update Hook
    def get_update_information(self):
        return dict(
            CreatbotUtil=dict(
                displayName=self._plugin_name,
                displayVersion=self._plugin_version,
                type="github_release",
                user="kforth",
                repo="OctoPrint-CreatbotUtil",
                current=self._plugin_version,
                stable_branch=dict(
                    name="Stable", branch="main", comittish=["main"]
                ),
                # update method: pip
                pip="https://github.com/kforth/OctoPrint-CreatbotUtil/archive/{target_version}.zip",
            )
        )


__plugin_name__ = "CreatbotUtil"
__plugin_version__ = "1.0.0"
__plugin_description__ = "Various utility functions to make OctoPrint work better with Creatbot printers."
__plugin_pythoncompat__ = ">=2.7,<4"
__plugin_implementation__ = CreatbotUtilPlugin()
__plugin_hooks__ = {
    "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
    "octoprint.comm.protocol.gcode.sending": __plugin_implementation__.gcode_sending_hook
}

