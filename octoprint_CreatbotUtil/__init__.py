# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
from enum import Enum

import octoprint.plugin
import logging

GCODE_START_SERIAL_PRINT =  "M6006" # Start Serial print
GCODE_STOP_SERIAL_PRINT =   "M6007" # Stop Serial print
GCODE_OG_CHAMBER_TEMP =     "M141"  # Original Marlin 'Set Chamber Temp' command
GCODE_SET_CHAMBER_TEMP =    "M6013" # (like M140) Set Chamber Temp.

PROFILE_MODE_ALL = "ALL"

class CreatbotUtilPlugin(octoprint.plugin.EventHandlerPlugin,
                         octoprint.plugin.SettingsPlugin,
                         octoprint.plugin.AssetPlugin,
                         octoprint.plugin.TemplatePlugin):

    def __init__(self):
        self._logger = logging.getLogger(__name__)
        
        self._sendStartStopCommands = True
        self._replaceHeatedChamberCommand = True
        self._profileMode = PROFILE_MODE_ALL
        self._selectedProfiles = []

    def initialize(self):
        self._sendStartStopCommands = self._settings.get_boolean(["sendStartStopCommands"])
        self._replaceHeatedChamberCommand = self._settings.get_boolean(["replaceHeatedChamberCommand"])
        self._profileMode = self._settings.get(["profileMode"])
        self._selectedProfiles = self._settings.get(["selectedProfiles"])

    def _enabled_for_current_profile(self):
        if self._profileMode == PROFILE_MODE_ALL:
            return True
        profile = self._printer_profile_manager.get_current()
        return profile and profile.get('id', None) in self._selectedProfiles

    ##~~ AssetPlugin
    def get_assets(self):
        return {
            'js': ["js/CreatbotUtil.js"],
        }

    ##~~ SettingsPlugin
    def get_settings_defaults(self):
        return {
            "sendStartStopCommands": True,
            "replaceHeatedChamberCommand": True,
            "profileMode": PROFILE_MODE_ALL,
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
        if event not in ("PrintStarted", "PrintStopped", "PrintCancelled", "PrintDone"):
            return
        if not self._enabled_for_current_profile():
            return
        if self._sendStartStopCommands:
            if event == "PrintStarted":
                self._logger.info("Starting Serial Print")
                self._printer.commands([GCODE_START_SERIAL_PRINT])
            elif event in ("PrintStopped", "PrintCancelled", "PrintDone"):
                self._logger.info("Stopping Serial Print")
                self._printer.commands([GCODE_STOP_SERIAL_PRINT])

    ##~~ Gcode Sending Hook
    def gcode_sending_hook(self, comm_instance, phase, cmd, cmd_type, gcode, *args, **kwargs):
        if gcode == GCODE_OG_CHAMBER_TEMP:
            if self._enabled_for_current_profile() and self._replaceHeatedChamberCommand:
                cmd = GCODE_SET_CHAMBER_TEMP + cmd[len(gcode):]
                self._logger.info("Replacing %s command with %s: %s", gcode, GCODE_SET_CHAMBER_TEMP, cmd)
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
__plugin_version__ = "1.1.0"
__plugin_description__ = "Various utility functions to make OctoPrint work better with Creatbot printers."
__plugin_pythoncompat__ = ">=2.7,<4"
__plugin_implementation__ = CreatbotUtilPlugin()
__plugin_hooks__ = {
    "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
    "octoprint.comm.protocol.gcode.sending": __plugin_implementation__.gcode_sending_hook
}

