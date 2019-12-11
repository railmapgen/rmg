# Rail Map Generator

Demo page: https://wongchito.github.io/RailMapGenerator/

**Notice:**

- The Rail Map Generator is tested on Google Chrome (>= 74.0) **ONLY**. Using other browsers may have unexpectedly results. 
- The railway map shown initially is a template for designing new your own railway and for debugging. It does not reflect the actual situation. 

Previous version: [GenRailMap](https://github.com/wongchito/GenRailMap) (to be deprecated)

## Version History

### 1.2.1 (12 Dec 2019)

#### Known Issues

- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 
- Text are not completely translated. 

#### Resolved Issues

- Fixed an error of station number misalignment in Guangzhou Metro style. 
- Updated templates to incorporate Guangzhou Metro style. 
- Continued on translations. 

### 1.2 (11 Dec 2019)

#### New Features

- Station info board in Guangzhou Metro style is now available!

#### Known Issues

- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 
- Text are not completely translated. 

#### Resolved Issues

- Updated data structure for upcoming features. 
- Improved structure of some panels. 

### 1.1.1 (7 Dec 2019)

#### New Features

- New templates available. 

#### Known Issues

- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 
- Text are not completely translated. 

#### Resolved Issues

- Fixed the issue that translated text may not be properly loaded.
- Fixed the error that station name background does not align. 
- Improved robustness.

### 1.1 (6 Dec 2019)

#### New Features

- Traditional Chinese (Hong Kong) and Simplified Chinese are available. 

#### Known Issues

- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 
- Text are not completely translated. 

### 1.0 (3 Dec 2019)

#### New Features

- New favicon. 
- Out-station-interchange (2-2) now supported for the first and the last stations. (Example: Central-Hong Kong station of Tsuen Wan Line in Hong Kong. )
- New templates available.

#### Known Issues

- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 

### 0.12 (29 Nov 2019)

#### New Features

- New templates available. 

#### Known Issues

- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 

#### Resolved Issues

- Improved data structure as a preparation for coming features. 
- Simplified `path` elements of the line. 
- Fixed an error in colour configuration of Tokyo. 

### 0.11 (21 Nov 2019)

#### New Features

- An information panel is added. Please star, fork or support my work!
- New templates available. 

#### Resolved Issues

- Improved robustness.
- Fixed the issue that text does not align. 
- Fixed the error of the position of station names. 
- Fixed the issue that the horizontal interval being too narrow when line splits. 
- Fixed an internal error of adding station to branch.  

### 0.10 (20 Nov 2019)

#### New Features

- MTR legacy style supported and you can now name your line for reference. 
- New templates available. 

#### Known Issues
- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 

#### Resolved Issues
- Improved algorithm for determining station name position. 

### 0.9 (15 Nov 2019)

#### New Features

- New layout of station modification panel. 
- New theme colours from Chongqing and Seoul. 

#### Known Issues
- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 

#### Resolved Issues
- Fixed responsive UI issues when using tablet or phone. 
- Fixed errors in Guangzhou Metro Line 1 template. 
- Fixed the issue that buttons of newly add station card are not responsive. 

### 0.8 (8 Nov 2019)

#### New Features

- Options of City and Line selectors are now shown with flag and coloured indicator respectively, which makes you easier to choose a colour.
- Material Design is now applied on all selectors. 

#### Known Issues

- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 
- The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0. 
- Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration. 
  - Workaround: Avoid selecting disabled options. 

### 0.7 (29 Oct 2019)

#### New Features

- New themes from numerous cities are available: Dongguan, Kaohsiung, Macau, New Taipei, San Francisco, Shanghai, Taipei, Tokyo.
- You can now customise the padding size of the line to avoid long station names overflow. 

#### Known Issues

- Sliders may stop working randomly. We are investigating this issue. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 

### 0.6 (28 Oct 2019)

#### New Features

- Got a ridiculously long station name (e.g. Sino-Singapore Guangzhou Knowledge City)? Now you can wrap the name by adding a backslash (`\`). 
- More templates are available now. You can design your line based on existing railway without entering all the details manually. 
- You can now export canvas as SVG. The exported SVG keeps fonts and all other information which allow you to share your work to your friends. 

#### Known Issues

- Sliders may stop working if the browser window is resized while Layout tab is not focused. 
- Slider values may not be initialised correctly after importing or resetting configuration. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 

#### Resolved Issues

- Station selector now sorts options in topological ordering. 
- Fixed the issue that notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow. 

### 0.5 (22 Oct 2019)

#### New Features

- More browsers are now supported. 
- Customisation of Chinese character-form is now available. 
- Material Design is applied to all setting panels. 

#### Known Issues

- Station selector may not sort options in a reasonable order. 
- Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top. 
- Sliders may stop working if the browser window is resized while Layout tab is not focused. 
- Slider values may not be initialised correctly after importing or resetting configuration. 
  - Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode. 

### 0.4 (20 Oct 2019)

#### New Features

- Adding branches is now available.
- Setting current station is now available. 
- Exporting and importing configuration file are now available. 

#### Known Issues

- Station selector may not sort options in a reasonable order. 
- Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top. 
- Sliders may stop working if the browser window is resized while Layout tab is not focused. 

#### Resolved Issues

- Removing all stations from a branch no longer affects subsequent manipulations of the line. 
- Fixed the initial value of vertical position slider. 

### 0.3 (18 Oct 2019)

#### New Features

- Adding stations is now available. You can now design your own railway line. 

#### Known Issues

- Adding a new branch is currently not available. 
  - Workaround: Use branches provided in the template and add/edit/remove stations within these branches. 
- Removing all stations from a branch may have unexpectedly results in subsequent manipulations. 
- Station selector may not sort options in a reasonable order. 
- Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top. 
- Sliders may stop working if the browser window is resized while Layout tab is not focused. 

### 0.2 (17 Oct 2019)

#### New Features

- Customisations of all fields (except adding stations) are now available! 

#### Known Issues

- Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top. 
- Sliders may stop working if the browser window is resized while Layout tab is not focused. 

### 0.1 (15 Oct 2019)

#### New Features

- The first demo of Rail Map Generator is now online! 
- Line and stations can be automatically loaded from JSON configuration file and drawn as Scalable Vector Graphic (SVG). 
- The theme colour can be customised. Selections include colour standards from mass transport systems in Beijing, Edinburgh, Foshan, Glasgow, Guangzhou, Hong Kong, London, Shenzhen and Toronto. 
- Customisations of the train direction and platform number are available. 