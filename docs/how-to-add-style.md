# How to add a new style for RMG?

To successfully implement a new style, you must be familiar with `React` and `TypeScript`. 

In this tutorial, MTR (Shenzhen) (`mtrsz`) is used as an example. 

## Preparation

You have to determine the canvases which should be implemented for the style you've chosen. You may choose any canvas from the following list. 

- Destination sign, which shows the direction and the terminal station of the train, and the platform number (if applicable). 
- Running-in board, which shows the name and relevant details of the current station. 
- Rail map, which shows the map of the entire line. 

## Initialising

The canvases of each style is implemented separately as React components, while some helper functions may be shared across different components as a module. 

For example, if you wish to initialise the destination sign of your new style, follow the instruction below to create or edit files. 

```tsx
// /src/svgs/destination/index.ts

// ...
case 'mtrsz': 
    return React.lazy(() => import(/* webpackChunkName: "destinationMTRSZ" */ './destination-mtrsz'));
```

```tsx
// /src/svgs/destination/destination-mtrsz.tsx

import * as React from 'react';

const DestinationMTRSZ = () => {
    return <>{/* */}</>;
}

export default DestinationMTRSZ;
```

Additionally, you have to tell `App` component which canvases are included in your style. 

```tsx
// /src/App.tsx

// ...
const canvasAvailable = 
    // ...
    case 'mtrsz':
        // return a array of selected canvases
        return ['destination'];
// ...
```

By now, your are able to test your new style by querying `?style=mtrsz` in your browser. 

## Description (Legacy)

### To add new text ui

Add new language entry at ```/locale/*.json``` if you add selection at ```index.html:444```

### To change destination info

Rewrite the ```drawDestInfo``` in your ```Line**.ts```. Remember to check the following elements according to your style.

* the destination text
* the arrow (optional)
* the platform number (optional)
* the line number (optional)
* the decoration line (optional)

#### The destination text

You may refer to ```lValidDests``` or  ```rValidDests``` to get the destination station name.

#### The decoration line (optional)

* Try to get the svg width by using ```_svgDestWidth```.
* Use ```_direction``` to get direction.

### To change station style in railmap

Rewrite the ```iconHTML``` and ```nameHTML``` in your ```Station**.ts```. Typically, only class need to be changed and refer the rest from the base ```Station.ts```.

#### In case you need a new path

Add specific svg path at ```index.html:svg#railmap.defs```. This is where the ```xlink:herf``` links from.

#### The use of ```html``` and ```ungrpHTML```

This two will call the ```iconHTML``` and ```nameHTML``` you rewrite and warp them under a ```<g>``` tag. So when you want to add new function to add additional elements, rewrite them.

### To change line style in railmap

The main functions are ```drawLine``` and ```fillThemeColour```. In addition, ```_linePath``` could be rewrited.

### To fix the mysterious black rect

![mysterious black rect](mysterious_black_rect.png)
Rewite the ```updateStnNameBg``` in ```RMGLine**``` at ```/src/Line/Line**.ts``` and add ```$('#current_bg').hide();```.

## Style-specific parameters

### Line

| func/parm       | description                                                |
| --------------- | ---------------------------------------------------------- |
| drawDestInfo    | Control the left side of the preview, the destination info |
| lValidDests     | The left side destinations (includes all branches)         |
| rValidDests     | The right side destinations (includes all branches)        |
| drawLine        | Draw the line in the right side of the preview             |
| fillThemeColour | Fill Theme Colour                                          |
| initSVG         | All magic starts here                                      |

### Station

| func/parm | description   |
| --------- | ------------- |
| iconHTML  | Draw the icon |
| nameHTML  | Draw the name |

## Old description

The core modules of this project consist of 2 parts - drawing SVG and providing control panels for manipulating the line and stations. 

**Drawing SVG**

`/src/Station/` [(README)](src/Station) - Classes for calculating all properties of station icon including name, interchange, position etc., in different styles. The base-class is `RMGStation` (default for MTR style) and all other classes inherit from `RMGStation` (e.g. `Int2Station`, `RMGStationGZ`, etc.). 

`/src/Line/` [(README)](src/Line) - Classes for drawing line and stations (with properties calculated from `Station.ts`) in different styles. The base-class is `Line` which is default for MTR and `LineGZ` is for Guangzhou Metro. 

`index.html` - Styles and elements that are used repeatedly are defined in `<style>` and `<def>`. 

**Control panels**

`/src/page_loader.ts` - Functions for initialising the panels (one for each tab). The current 2 styles share almost the same fields of parameters (some parameters are different in 'Design' tab). 

**How to start a new style (example)**

1. Adding style-specific parameters would be much more difficult because the functions in `/src/page_loader.ts` are highly integrated. It would be made clearer in near future. 
