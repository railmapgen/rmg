# How to add a new style for RMG?

To successfully implement a new style, you must be at least familiar with `TypeScript`. 

In this tutorial, MTR (Shenzhen) (`mtrsz`) is used as an example. 

## Initialising

To initialise your new style, following the example below to create or edit files. 

```TypeScript
// /src/Station/StationMTRSZ.ts
import { RMGStation } from './Station';
import { ID, StationInfo } from '../utils';

export class RMGStationMTRSZ extends RMGStation {
    constructor (id: ID, data: StationInfo) {
        super(id, data);
    }
}
```

```TypeScript
// /src/Line/LineMTRSZ.ts
import { RMGLine } from './Line';
import { RMGStationMTRSZ } from '../Station/StationMTRSZ';
import { RMGParam } from '../utils';

export class RMGLineMTRSZ extends RMGLine {
    constructor (param: RMGParam) {
        super(param);
    }
}
```

```TypeScript
// /src/Line/init.ts

// ...
const getLineClass = async (style: string) => {
    switch (style) {
        // ...
        case 'mtrsz': 
            return import(/* webpackChunkName: "LineMTRSZ" */ './LineMTRSZ')
                .then(({ RMGLineMTRSZ }) => RMGLineMTRSZ);
    }
}
// ...
```

```TypeScript
// /src/index.ts

// ...
switch (window.urlParams.get('style')) {
    case 'mtr':
    // ...
    case 'mtrsz':
        break;
    default: // ...
}
// ...
```

By now, your are able to test your new style by querying `?style=mtrsz` in your browser. If you want to change between styles without repeatedly modifying the address, you should add the following code chunk to `div#style_diag` of `index.html`. 

```HTML
<li class="mdc-list-item" data-mdc-dialog-action="mtrsz">
    <span class="mdc-list-item__text" trans-tag="File.Style.MTRSZ"></span>
</li>
```

## Style-specific parameters

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
