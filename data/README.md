This directory contains

- `city_list.json`, a list of cities sorted by their English name in alphabetical order; and
- `[city].json`, a list of colours used in the city's public transportation system. 

A typical example of an entry of `city_list.json`:

```JSON
{
    "id": "sanfrancisco", // Same as the filename of colour list file
    "country": "US", // ISO 3166-1 alpha-2 code (for cities in Britain, append BS 6879 code)
    "name": {
        "en": "San Francisco", 
        "zh-Hans": "旧金山", 
        "zh-HK": "三藩市", 
        "zh-TW": "舊金山"
        // Merge country variants if applicable
    }
}
```

A typical example of an entry of `guangzhou.json`:

```JSON
{
    "id": "gz3", 
    "name": {
        "en": "Line 3", 
        "zh-Hans": "3号线", 
        "zh-Hant": "3號線", 
    }, 
    "colour": "#ECA154", 
    "fg": "#000" // Mandatory if foreground colour is not white
}
```

### Reference

| City | Reference |
| --- | --- |
| Guangzhou | [不知道有没有火星。。-广 州 区-地铁族](http://www.ditiezu.com/forum.php?mod=viewthread&tid=523725) |
| London | [Colour standards - Transport for London](http://content.tfl.gov.uk/tfl-colour-standards-issue04.pdf) |
| Toronto | [Signage Manual and Standards - Toronto Transit Commission](https://joeclark.org/design/signage/TTC/2015/TTCWayfindingStandardsManual_201409.pdf)
