# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

import octoprint.plugin
import logging

class CreatbotUtilPlugin(octoprint.plugin.SettingsPlugin,
                                   octoprint.plugin.AssetPlugin,
                                   octoprint.plugin.TemplatePlugin,
                                   octoprint.plugin.StartupPlugin):
    def __init__(self):
        self._logger = logging.getLogger(__name__)

    ##~~ StartupPlugin
    def on_after_startup(self):
        self._logger.info(f"CreatbotUtil Loaded")


    ##~~ AssetPlugin
    def get_assets(self):
        # Define your plugin's asset files to automatically include in the
        # core UI here.
        return dict(
            js=["js/CreatbotUtil.js"],
        )

    ##~~ SettingsPlugin
    def get_settings_defaults(self):
        return {
            "enable_plugin": True,
            "profile_mode": "All",
            "profile_list": []
        }

    # ~~ TemplatePlugin
    def get_template_configs(self):
        return [
            {
                "type": "settings",
                "name": "CreatbotUtil",
                "template": "CreatbotUtil_settings.jinja2",
                "custom_bindings": False,
            }
        ]

    ##~~ Gcode Sending Hook
    def gcode_sending_hook(self, comm_instance, phase, cmd, cmd_type, gcode, *args, **kwargs):
        if self._settings.get_boolean(['enable_plugin']):
            if gcode and gcode == "M141":
                cmd = "M6013" + cmd[4:]
                self._logger.info(f"Replacing M141 command with M6013: {cmd}")
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
__plugin_version__ = "1.0.1"
__plugin_description__ = "Replace the default Marlin heated build volume command (M141) with the Creabot version (M6013)."
__plugin_pythoncompat__ = ">=2.7,<4"
__plugin_implementation__ = CreatbotUtilPlugin()
__plugin_hooks__ = {
    "octoprint.comm.protocol.gcode.sending": __plugin_implementation__.gcode_sending_hook,
    "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
}

"""
Other Creatbot GCode Commands:
 * M6001 - Pause print same as M600 but not retracting filament.
 * M6002 - Resume print from M6001.
 * M6003 - Unload filament after detect filament broken
 * M6004 - Resume print from accident
 * M6005 - Home & Resume print from accident
 * M6006 - Start Serial print
 * M6007 - Stop Serial print
 * M6008 - Set used Time											(M6008 S0.00)
 * M6009 - Set regSN												(M6009 S0.00)
 * M6010 - Adjust the Z Value after adjust zprobe_zoffset		    (Requires HAS_BED_PROBE)
 * M6011 - (like M106) Set Temp fan.								(Requires HAS_AUTO_FAN)
 * M6012 - (like M106) Set Air fan.									(Requires HAS_AIR_FAN)
 * M6013 - (like M140) Set Chamber Temp. 							(Requires HOTWIND_SYSTEM)
 * M6014 - (include G29) Probe the bed.								(Requires HAS_LEVELING)
 * M6020 - (like M20) List USB
 * M6021 - (like M21) Init USB
 * M6022 - (like M22) Release USB
 * M6023 - (like M23) Select USB file
 * M6024 - (like M24) Start/resume USB print
 * M6025 - (like M25) Pause USB print
 * M6026 - (like M26) Set USB position in bytes
 * M6027 - (like M27) Report USB print status
 * M6028 - (like M28) Start USB write.								TODO M6028
 * M6029 - (like M29) Stop USB write.								TODO M6029
 * M6030 - (like M30) Delete file from USB.						    TODO M6030
 * M6032 - (like M32) Select file and start SD print
 * M6033 - (like M928) Start USB write (logging)			        TODO M6033
"""
