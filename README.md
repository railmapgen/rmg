# Rail Map Generator

Demo page: https://wongchito.github.io/RailMapGenerator/

**Notice:**

- The Rail Map Generator is tested on Google Chrome (>= 74.0) **ONLY**. Using other browsers may have unexpectedly results. 
- The railway map shown initially is a template for designing new your own railway and for debugging. It does not reflect the actual situation. 

Previous version: [GenRailMap](https://github.com/wongchito/GenRailMap) (to be deprecated)

## Version History

### 0.4 ()

#### New Features

- Adding branches is now available.
- Setting current station is now available. 

#### Known Issues

- Station selector may not sort options in a reasonable order. 
- Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top. 
- Sliders may stop working if the browser window is resized while Layout tab is not focused. 

#### Resolved Issues

- Removing all stations from a branch no longer affects subsequent manipulations of the line. 

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