# OctoPrint-CreatbotUtil
Various utility functions to make OctoPrint work better with Creatbot printers.

## Features:
- Send "Pause/Resume" commands with OctoPrint state changes. (M6001 & M6002)
- Send "Start/Stop Serial Print" commands with OctoPrint state changes. (M6006 & M6007)
- Substitute Marlin Heated Chamber command for Creatbot version. (M141 -> M6013)

## Setup

Install via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html).

Open OctoPrint Settings (wrench icon) -> Plugin Mananger -> Get More -> Paste the url from below in the "... from URL" field. 

> https://github.com/kForth/OctoPrint-CreatbotUtil/archive/main.zip

Retart the instance after installing.


## License

Copyright © 2022 [Kestin Goforth](http://github.com/kforth/).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.en.html) for more details.