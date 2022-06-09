# OctoPrint-CreatbotUtil

Various utility functions to make OctoPrint work better with Creatbot printers.

This plugin has been tested to work well with the Creatbot F430 but should work with other Creatbot printers.

Your Creatbot firmware may need to be upgraded to at least v5.6, the original v5.5 firmware that shipped with my Creatbot F430 did not support the Heated Chamber (M6013) command.

## Features

- Send "Start/Stop Serial Print" commands with OctoPrint state changes.

- Use Creatbot Heated Chamber command instead of default Marlin version (M141).

## Screenshot

<img src="https://github.com/kForth/OctoPrint-CreatbotUtil/blob/media/octoprint-creatbot-util-settings-screenshot.png?raw=true" alt="Settings Page Screenshot" title="Settings Page Screenshot" style="max-width: 80%">

## Setup

Install via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html).

Open OctoPrint Settings (wrench icon) -> Plugin Mananger -> Get More -> Paste the url from below in the "... from URL" field. 

> https://github.com/kForth/OctoPrint-CreatbotUtil/archive/main.zip

Retart the instance after installing.


## License

Copyright © 2022 [Kestin Goforth](http://github.com/kforth/).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.en.html) for more details.