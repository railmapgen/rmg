# Rail Map Generator

Demo page: https://wongchito.github.io/RailMapGenerator/

**Notice:**

- The Rail Map Generator is tested on Google Chrome (>= 74.0) **ONLY**. Using other browsers may have unexpectedly results. 
- The railway map shown initially is a template for designing new your own railway and for debugging. It does not reflect the actual situation. 

[Version History](VersionHistory.md)

(Detailed description will be provided. )

The core modules of this project consist of 2 parts - drawing SVG and providing control panels for manipulating the line and stations. 

**Drawing SVG**

`/src/Station/` [(README)](src/Station) - Classes for calculating all properties of station icon including name, interchange, position etc., in different styles. The base-class is `RMGStation` (default for MTR style) and all other classes inherit from `RMGStation` (e.g. `Int2Station`, `RMGStationGZ`, etc.). 

`/src/Line/` [(README)](src/Line) - Classes for drawing line and stations (with properties calculated from `Station.ts`) in different styles. The base-class is `Line` which is default for MTR and `LineGZ` is for Guangzhou Metro. 

`index.html` - Styles and elements that are used repeatedly are defined in `<style>` and `<def>`. 

**Control panels**

`/src/page_loader.ts` - Functions for initialising the panels (one for each tab). The current 2 styles share almost the same fields of parameters (some parameters are different in 'Design' tab). 

**Environments**

Only one thing is needed to be install - TypeScript. I use the other modules directly from CDN. (I didn't find a way to import Material Components (MDC) into TypeScript so `/src/page_loader.ts` is full of error messages. )

**How to start a new style (example)**

1. Create new classes `LineSZ` and `RMGStationSZ` inheriting from `Line` and `RMGStation` respectively (or `LineGZ` and `RMGStationGZ` if you prefer). 
2. Edit methods, for example, changing `RMGStationSZ.iconHTML` to accommodate the style of station icon in Shenzhen Metro style, or changing `LineSZ.drawDestInfo()` to draw a different destination information panel. 
3. Adding style-specific parameters would be much more difficult because the functions in `/src/page_loader.ts` are highly integrated. It would be made clearer in near future. 
