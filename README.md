
# CreatBot Util

This plugin add various utility functions to make OctoPrint work better with CreatBot printers.

## Features

- Send "Start/Stop Serial Print" commands whenever a print is started, cancelled, or finished (M6006 & M6007).

- Replace the Marlin 'Set Chamber Temperature' command (M141) with the CreatBot command (M6013).

## Screenshot

![Settings Page Screenshot](https://github.com/kForth/OctoPrint-CreatbotUtil/blob/media/octoprint-creatbot-util-settings-screenshot.png?raw=true)

## Setup

Install via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html).

Open OctoPrint Settings (wrench icon) -> Plugin Manager -> Get More -> Paste the url from below in the "... from URL" field.

> https://github.com/kForth/OctoPrint-CreatbotUtil/archive/main.zip

Retart the instance after installing.

## Notes

This plugin should work for most/all CreatBot 3D Printers but has only been tested with a CreatBot F430.

Your CreatBot firmware may need to be upgraded to at least v5.6, the original v5.5 firmware that shipped with my CreatBot F430 did not support the Heated Chamber (M6013) command.


## License

Copyright © 2022 [Kestin Goforth](http://github.com/kforth/).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.en.html) for more details.
