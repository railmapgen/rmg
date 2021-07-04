# Changelog

# 3.8.26 (07 Jul 2021)

### New Features

-   New runin terminal style of Shanghai Metro 2020 (#83).
-   Parallel destination name of Shanghai Metro 2020 (#83).
-   Missing maglev in the template of Shanghai Metro line 2 (#85).
-   Update the template of Shanghai Metro line 1.

# 3.8.25 (23 Mar 2021)

### New Features

-   Shanghai Metro's 2020 new style (#68).

# 3.8.20 (8 Nov 2021)

### New Features

-   New templates are available: Shanghai Metro Line 2, Shanghai Metro Line 5 and Shanghai Metro Line 16.

# 3.8.18 (25 Oct 2021)

### New Features

-   Shanghai Metro Style supports **Maglev** icon.
-   Shanghai Metro Style supports **Only for Public Transportation Card** hint.

## 3.8 (20 Jun 2020)

### New Features

-   Added express and direct services for Shanghai Metro style.
-   New templates are available: Shanghai Metro Line 1 and Shanghai Metro Line 16.

## 3.7.2 (15 May 2020)

### New Features

-   Updated TypeScript to 3.9.2.
-   Added Prettier to local dependencies.

### Resolved Issues

-   Fixed typos.

## 3.7.1 (22 Apr 2020)

### Resolved Issues

-   Fixed the issue where interchange boxes mis-align in Shanghai Metro style.
-   Fixed [#42](https://github.com/wongchito/RailMapGenerator/issues/42).

## 3.7 (14 Apr 2020)

### New Features

-   Stations' names can now be placed below the line when they are not staggered in MTR style.
-   Added selections of recently used colour-name combinations in colour editing dialogue. ([#25](https://github.com/wongchito/RailMapGenerator/issues/25))
-   Supported platform number in Shanghai Metro style.

### Resolved Issues

-   Simplified paths (strip) with `<marker>`.
-   Refined sizes, aspect ratios and alignments of some elements in Shanghai Metro style.

## 3.6.7 (13 Apr 2020)

### New Features

-   New palettes: Kansai Area and Osaka
-   Redesign layout of colour editing dialogue.

### Resolved Issues

-   Fixed the issue where font size in exported PNG is incorrect.
-   Fixed the issue where font are not correctly rendered in exported PNG.

## 3.6.6 (11 Apr 2020)

### New Features

-   Supported panel type of Guangzhou Metro Line 2/8 (Otis).
-   ~~Supported progressive web app (PWA) (beta).~~

### Resolved Issues

-   Fixed alignment issue in destination sign of Shanghai Metro style.
-   Reordered canvas's background and border.
-   Improved algorithms of loading rendered fonts in MTR style.

## 3.6.5 (6 Apr 2020)

### New Features

-   Added Terms and Conditions in the preview dialogue.

### Resolved Issues

-   Improved decoration line under stations' names in Shanghai Metro style.

## 3.6.4 (5 Apr 2020)

### New Features

-   Rotations of stations' names in Shanghai Metro style are now determined by train direction.
-   New theme colours for Madrid.

### New Features

## 3.6.3 (5 Apr 2020)

### New Features

-   New theme colours for Oslo, Stockholm and Tyne and Wear.
-   Added decoration line under names of stations whose are interchange stations in Shanghai Metro style. (#29)

### Resolved Issues

-   Fixed the issues where OSI text is not removed when OSI has been removed in Shanghai Metro style. (#29)

## 3.6.2 (2 Mar 2020)

### New Features

-   New design of 'Stations' panel.
-   New theme colours for Barcelona.

### Resolved Issues

-   Fixed an error where invalid attributes are passed to elements when secondary name is empty in Guangzhou Metro style.

## 3.6.1 (31 Mar 2020)

### Resolved Issues

-   Fixed an error where exports from Firefox are empty. (#26)
-   Improved compatibility for Safari and Firefox.

## 3.6 (30 Mar 2020)

### New Features

-   New interface of station name editing dialogue.
-   Secondary station name is supported in Guangzhou Metro style.
-   New theme colours for Nanjing, Paris, Qingdao, Tianjin.

## 3.5.6 (29 Mar 2020)

### Resolved Issues

-   Fixed an error that occurs when reversing stations more than once.
-   Caught errors in exporting process.
-   Improved robustness.

## 3.5.5 (28 Mar 2020)

### New Features

-   New design of export and preview dialog, which allows you to customise the styles (including transparent background, border and scaling) of the exported images. (#2)
-   New theme colours for Hangzhou.

### Resolved Issues

-   Fixed a typo in panel type's description.

## 3.5.4 (27 Mar 2020)

### New Features

-   You may now stop staggering stations' names in MTR style and place them above the line.
-   New template available (MTR Disneyland Resort Line).

### Resolved Issues

-   Fixed an error in rail map where the background of current station has incorrect size in MTR style.
-   Fixed an error in destination sign where possible terminals are incorrect.

## 3.5.3 (27 Mar 2020)

### Resolved Issues

-   Completed type of `RMGParam` and get rid of index signatures.
-   Simplified parameter update process.

## 3.5.2 (27 Mar 2020)

### New Features

-   Added types of information panels for Line 4, Line 5 and Guangfo Line Phase 1 in Guangzhou Metro style.
-   Updated information panel type selector.
-   Deployed on [GitLab Pages](https://chitowong.gitlab.io/RailMapGenerator) as a backup plan.

### Resolved Issues

-   Fixed an backward compatibility issue in running-in board of Shanghai Metro style.

## 3.5.1 (24 Mar 2020)

### New Features

-   You may now switch between styles without refreshing the whole web page.
-   Improved layout for tablet/desktop users.

### Resolved Issues

-   Fixed an issue in design panel where sliders of note's position don't respond in Guangzhou Metro style.

## 3.5 (22 Mar 2020)

### New Features

-   Update environment to `create-react-app` set-up. This includes the following changes:
    -   New directories of assets, and
    -   Strict mode in TypeScript.
-   Added error boundary to SVG components.

### Resolved Issues

-   Fixed an issue in running-in board where the position of next stations are not updated automatically in Guangzhou Metro style.

## 3.4.3 (21 Mar 2020)

### New Features

-   Widths of destination sign and running-in board can be adjusted separately.
-   Border can be added to notes in Guangzhou Metro style.
-   Span shared parts of names in Chinese and Latin characters in Guangzhou Metro style.

### Resolved Issues

-   Improved performance and robustness

## 3.4.2 (19 Mar 2020)

### Resolved Issues

-   Fixed the issues in Guangzhou Metro or Shanghai Metro style where interchange text overflows.

## 3.4.1 (16 Mar 2020)

### New Features

-   Notes can now be added to rail map canvas in Guangzhou Metro style.

### Resolved Issues

-   Fixed the scrolling issues in Firefox.

## 3.4 (15 Mar 2020)

### New Features

-   Destination sign in MTR style is now able to be customised.
-   Canvases are now able to be zoomed in and out.
-   Canvas selected to be shown will be memorised.

### Resolved Issues

-   Fixed the error of auto-numbering in Guangzhou Metro style.
-   Improved UI.

## 3.3.2 (14 Mar 2020)

### Resolved Issues

-   Fixed the issues of overflow content.
-   Fixed the errors of multiple within-station interchanges in MTR style.
-   Improved backward compatibility.
-   Improved robustness.

## 3.3.1 (14 Mar 2020)

### New Features

-   New templates available.

### Resolved Issues

-   Fixed an issue in interchange editing dialog.
-   Improved documentation for new framework.

## 3.3 (13 Mar 2020)

### New Features

-   Migrated the entire project to React.

## 3.2.1 (10 Mar 2020)

### New Features

-   New templates available.

### Resolved Issues

-   Fixed the errors in the templates provided.
-   Improved performance.

## 3.2 (6 Mar 2020)

### New Features

-   Interchange stations with 3 and 4 lines are now supported in MTR style.
-   Improved UI.

### Resolved Issues

-   Fixed the issues that language switcher may not working randomly.
-   Fixed the issues that OSI names in Latin characters are not split as expected.

## 3.1.3 (5 Mar 2020)

### Resolved Issues

-   Fixed the error occurring while removing stations.
-   Fixed the issues that OSI names in Latin characters are not split as expected.
-   Disabled branch position selection for Shanghai Metro style.
-   Improved performance.

## 3.1.2 (4 Mar 2020)

### New Features

-   New templates are available.

### Resolved Issues

-   Fixed the issue of incorrect font size in exported PNG.
-   Improved performance and robustness.

## 3.1.1 (1 Mar 2020)

### New Features

-   Colour picker is back!

### Resolved Issues

-   Improved robustness.

## 3.1 (1 Mar 2020)

### New Features

-   Dark mode is coming!

### Resolved Issues

-   Fixed the issues that interchanges do not display in Shanghai Metro style.

## 3.0 (29 Feb 2020)

### Resolved Issues

-   Fixed an error in station adding dialog.

## 3.0 (Beta 2) (28 Feb 2020)

### Resolved Issues

-   Fixed the issues of incomplete translations.
-   Fixed multiple displaying issues.

## 3.0 (Beta) (27 Feb 2020)

### New Features

-   Rewrite settings panel with React.

### Known Issues

-   Text are not completely translated.
-   UI elements may have unexpected position.

## 2.16 (23 Feb 2020)

### New Features

-   Running-in board is now available in Shanghai Metro style.

## 2.15.2 (22 Feb 2020)

### Resolved Issues

-   Improved semantics of font rendering process in MTR style.

## 2.15.1 (21 Feb 2020)

### Known Issues

-   Fonts for Chinese characters may be missing in MTR style. (Workaround: Wait for serveral seconds before selecting 'Download'. )

### Resolved Issues

-   Fixed the issues that fonts incorrectly rendered in exported PNG in MTR style.

## 2.15 (20 Feb 2020)

### New Features

-   You can now add a icon indicating airport or other facility to a station in MTR style.
-   New templates are available.

## 2.14.1 (20 Feb 2020)

### Resolved Issues

-   Fixed the incorrect colour and style with the official ones used in MTR style.

## 2.14 (19 Feb 2020)

### New Features

-   Branching-out stations are now available in MTR style.
-   Out-of-station interchange are now availabel in Shanghai Metro style.

### Resolved Issues

-   Re-drawn line segment involving arcs (curves) in MTR style.
-   Fixed the issue that a station are not re-drawn when it is upgraded to a branching-out station in Guangzhou Metro style.

## 2.13.1 (18 Feb 2020)

### New Features

-   New button showing all canvases.

### Resolved Issues

-   Utilised CSS variables.

## 2.13 (18 Feb 2020)

### New Features

-   Split `index.html` to multiple `html` files and is built to a minimised version when distributing. Users may save up to 60KB when loading the web page.

## 2.12.1 (18 Feb 2020)

### Resolved Issues

-   Fixed the error that station names in station adding dialogue are not updated.

## 2.12 (17 Feb 2020)

### New Features

-   You can now re-number all the stations on the main line at ease in Guangzhou Metro style.

### Resolved Issues

-   Fixed the issue that express station tags in Guangzhou Metro style do not follow the theme colour.

## 2.11.2 (16 Feb 2020)

### New Features

-   Utilised CSS variables.

## 2.11.1 (16 Feb 2020)

### Resolved Issues

-   Fixed the issue of text content of station chip not updated when the name of the station is changed.
-   Fixed the issue of interchange box of branching station in Guangzhou Metro style not updated when the theme colour or the name of the line is changed.
-   Improved the horizontal position of the line in Guangzhou Metro style such that the margins of both left and right sides are similar.
-   Improved CSS rules to avoid frequently modifying elements' attributes.

## 2.11 (15 Feb 2020)

### New Features

-   Customising colour is now available in colour selectors.

## 2.10 (15 Feb 2020)

### New Features

-   New design of station editing panel.
-   Progress bar is now added for indicating panel initialising process.

## 2.9 (14 Feb 2020)

### New Features

-   The height of canvases are now able to be customised. Some templates are updated accordingly.

## 2.8.2 (14 Feb 2020)

### New Features

-   Flag Emojis can be shown on Windows platforms now! (All flag emojis shown on Windows platforms are designed by [OpenMoji](https://openmoji.org/) - the open-source emoji and icon project. License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/#))
-   Separated type definitions from `/src/utils.ts`.
-   Updated dialogue of branch editing.

## 2.8.1 (13 Feb 2020)

### New Features

-   Separated classes `RMGLineHK` and `RMGStationHK` from classes `RMGLine` and `RMGStation` respectively.
-   Control panels initialisation are now loaded on demand to reduce loading time.

### Resolved Issues

-   Fixed an error occurring when a new station is added.

## 2.8 (13 Feb 2020)

### New Features

-   Stations with express services are shown with a side note in Guangzhou Metro style now! Templates of Guangzhou Metro Line 14 and Line 21 are updated accordingly.
-   Station name editing dialogue is now merged with station detail editing dialogue for consistency.

## 2.7 (12 Feb 2020)

### New Features

-   Shanghai Metro style is now available for trail (thanks [@thekingofcity](https://github.com/thekingofcity)). Please report any issue or feature request.

## 2.6 (10 Feb 2020)

### New Features

-   New dialogue for modifying interchanges with higher flexibility!

## 2.5.6 (9 Feb 2020)

### New Features

-   New theme colours for Chengdu and Xi'an.

### Resolved Issues

-   Fixed an issue in station adding process.

## 2.5.5 (8 Feb 2020)

### New Features

-   New data structure for incoming update.

### Resolved Issues

-   Fixed the issue of mis-positioning interchange name with more than one line in MTR style.
-   Fixed the error of including backslash in `<text>` elements.

## 2.5.4 (7 Feb 2020)

### New Features

-   RMG now supports Firefox!

### Resolved Issues

-   Improved interchanges in Guangzhou Metro style.

## 2.5.3 (6 Feb 2020)

### New Features

-   New format of default names of new station.
-   New colour schemes for Guangzhou.

### Resolved Issues

-   Improved backward compatibility.
-   Fixed the error of un-styled exported PNG.
-   Fixed the errors occurred when current station is removed.

## 2.5.2 (5 Feb 2020)

### Resolved Issues

-   Fixed the incorrect list of possible locations of a new station.
-   Separated CSS stylesheets for control panels from `index.html`.
-   Improved logic of determining the positions of station names in MTR style.
-   Updated documents and added typings for some methods.

## 2.5.1 (5 Feb 2020)

### Resolved Issues

-   Separated CSS stylesheets from `index.html`. ([#7](https://github.com/wongchito/RailMapGenerator/issues/7))

## 2.5 (4 Feb 2020)

### Resolved Issues

-   Fixed the incorrect style of 'Towards' information when there are two destinations in Guangzhou Metro style.

## 2.4.2 (4 Feb 2020)

### Resolved Issues

-   Fixed the errors in Tokyo's colour list.
-   Fixed the displaying issue of out-of-station interchange name field.
-   Fixed the incorrect list of possible locations of a new station.
-   Fixed the error that branch configuration of newly added station may be incorrect.
-   Fixed the incorrect station intervals caused by webpack minimal output.

## 2.4.1 (3 Feb 2020)

### Resolved Issues

-   Fixed the error that font sizes in exported PNG mutated by Chrome minimum font size feature.
-   Fixed the issue that the black rectangle indicating the current station for MTR style shown unexpectedly in other style.
-   Removed duplicated code and reduced repo size.

## 2.4 (2 Feb 2020)

### New Features

-   Updated environment for passing code check of code involving `material-components-web`.
-   Bundled codes with Webpack to minimise file size.
-   Loaded modules on demand.
-   (Documentations for the new environment will be provided later.)

## 2.3.2 (1 Feb 2020)

### Known Issues

-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.

### Resolved Issues

-   Improved robustness.
-   Updated `README`.

## 2.3.1 (31 Jan 2020)

### Known Issues

-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.

### Resolved Issues

-   Fixed the issue of oversized text when exporting canvas as PNG.

## 2.3 (31 Jan 2020)

### New Features

-   Platform screen door indicator of Guangzhou Metro Line 14/21 is available now. Vertical height of the canvas is now sufficient for most of the cases while using this information panel type.
-   New Templates available.
-   Added customisation of position of 'Towards' information in Guangzhou Metro style.

### Known Issues

-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.

### Resolved Issues

-   Updated algorithm for calculating horizontal position of station from line with branches in Guangzhou Metro style.
-   Updated algorithm for determining position of station name in Guangzhou Metro style.

## 2.2 (30 Jan 2020)

### New Features

-   Ma On Shan Line in Hong Kong is changed to Tuen Ma Line Phase 1, which will be open on 14 Feb 2020.
-   Platform screen door indicator of Guangzhou Metro Line 3 is available now.
-   Simple `README` for some modules are provided.

### Known Issues

-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.
-   Vertical height of the canvas may not sufficient for line with branches in Guangzhou Metro style.

## 2.1 (30 Jan 2020)

### New Features

-   Terminal-station-specific panel is now available.
-   Branching-out stations are now show as expected in Guangzhou Metro style.

### Known Issues

-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.
-   Vertical height of the canvas may not sufficient for line with branches in Guangzhou Metro style.

### Resolved Issues

-   Improved smoothness whilst changing vertical position.
-   Fixed the error of 'Towards' information on station name panel.
-   Fixed the error of drawing branches which bypass part of the stations on main line (sidings).

## 2.0 (23 Jan 2020)

### New Features

-   Wish you a happy Lunar New Year!
-   Full control of branches is now available! You may decide the type and position of each branch now.

### Known Issues

-   'Next stop' and 'Towards' information may be wrong when line includes branches.
-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.
-   Vertical height of the canvas may not sufficient for line with branches in Guangzhou Metro style.

### Resolved Issues

-   Improved robustness after migrating to TypeScript.

## 1.5.1 (3 Jan 2020)

### New Features

-   Migrated to Typescript.

### Known Issues

-   'Next stop' and 'Towards' information may be wrong when line includes branches.
-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.

### Resolved Issues

-   Fixed the issue that parameters may not be properly mutated when adding/removing station from a branch.

## 1.5 (29 Dec 2019)

### New Features

-   Out-station-interchange (2-2) is now available for all stations in MTR style.

### Known Issues

-   'Next stop' and 'Towards' information may be wrong when line includes branches.
-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.

## 1.4.1 (22 Dec 2019)

### New Features

-   Exporting to PNG is available for Guangzhou Metro style now.

### Known Issues

-   'Next stop' and 'Towards' information may be wrong when line includes branches.
-   PNG exported from MTR-style railway map and destination info panel may have incorrect font.

### Resolved Issues

-   Fixed the error when splitting and styling the line names in Guangzhou Metro style [(#1)](https://github.com/wongchito/RailMapGenerator/issues/1).

## 1.4 (17 Dec 2019)

### New Features

-   Direction is now shown in the railway map when using Guangzhou Metro style.
-   Reversing entire line is now available. You may make rail map for either side of a platform without re-entering the details.
-   More types of platform screen door indicator light are available.
-   New templates available.

### Known Issues

-   'Next stop' and 'Towards' information may be wrong when line includes branches.

### Resolved Issues

-   Fixed the issue that sliders may stop working randomly.
-   Fixed the error of unstyled name of line in Guangzhou Metro style.
-   Simplified code to reduce loading time.
-   Improved robustness.

## 1.3.3 (16 Dec 2019)

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.

### Resolved Issues

-   Completely translated all text.
-   Fixed the error of foreground colour misuse in Guangzhou Metro style.
-   Improved error handling.

## 1.3.2 (16 Dec 2019)

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   Text are not completely translated.

### Resolved Issues

-   Fixed the issue of misalignment of destination information in MTR style.
-   Fixed the error of displaying Guangzhou-Metro-style destination in MTR style.
-   Fixed the issue that JSON configuration file is not able to be downloaded in Safari for iOS.

## 1.3.1 (15 Dec 2019)

### New Features

-   Add basic support of all types of interchange stations for Guangzhou Metro style.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   Text are not completely translated.

## 1.3 (15 Dec 2019)

### New Features

-   Add support of interchange station with 2 lines for Guangzhou Metro style.
-   Add support of black foreground colour in Guangzhou Metro style.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   Text are not completely translated.

### Resolved Issues

-   Fixed the error of misalignment of current station indicator in MTR style.

## 1.2.2 (14 Dec 2019)

### New Features

-   The preview feature is available. You may have a full-screen view of your railway map or destination info board now.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   Text are not completely translated.

### Resolved Issues

-   Fixed the issue of disagreement of the styles of selectors
-   Fixed the error that disabled options in selectors are selectable.
-   Improved positioning of the two canvas.
-   Changed the CDN server of external JS files.

## 1.2.1 (12 Dec 2019)

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.
-   Text are not completely translated.

### Resolved Issues

-   Fixed an error of station number misalignment in Guangzhou Metro style.
-   Updated templates to incorporate Guangzhou Metro style.
-   Continued on translations.

## 1.2 (11 Dec 2019)

### New Features

-   Station info board in Guangzhou Metro style is now available!

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.
-   Text are not completely translated.

### Resolved Issues

-   Updated data structure for upcoming features.
-   Improved structure of some panels.

## 1.1.1 (7 Dec 2019)

### New Features

-   New templates available.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.
-   Text are not completely translated.

### Resolved Issues

-   Fixed the issue that translated text may not be properly loaded.
-   Fixed the error that station name background does not align.
-   Improved robustness.

## 1.1 (6 Dec 2019)

### New Features

-   Traditional Chinese (Hong Kong) and Simplified Chinese are available.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.
-   Text are not completely translated.

## 1.0 (3 Dec 2019)

### New Features

-   New favicon.
-   Out-station-interchange (2-2) now supported for the first and the last stations. (Example: Central-Hong Kong station of Tsuen Wan Line in Hong Kong. )
-   New templates available.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.

## 0.12 (29 Nov 2019)

### New Features

-   New templates available.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.

### Resolved Issues

-   Improved data structure as a preparation for coming features.
-   Simplified `path` elements of the line.
-   Fixed an error in colour configuration of Tokyo.

## 0.11 (21 Nov 2019)

### New Features

-   An information panel is added. Please star, fork or support my work!
-   New templates available.

### Resolved Issues

-   Improved robustness.
-   Fixed the issue that text does not align.
-   Fixed the error of the position of station names.
-   Fixed the issue that the horizontal interval being too narrow when line splits.
-   Fixed an internal error of adding station to branch.

## 0.10 (20 Nov 2019)

### New Features

-   MTR legacy style supported and you can now name your line for reference.
-   New templates available.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.

### Resolved Issues

-   Improved algorithm for determining station name position.

## 0.9 (15 Nov 2019)

### New Features

-   New layout of station modification panel.
-   New theme colours from Chongqing and Seoul.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.

### Resolved Issues

-   Fixed responsive UI issues when using tablet or phone.
-   Fixed errors in Guangzhou Metro Line 1 template.
-   Fixed the issue that buttons of newly add station card are not responsive.

## 0.8 (8 Nov 2019)

### New Features

-   Options of City and Line selectors are now shown with flag and coloured indicator respectively, which makes you easier to choose a colour.
-   Material Design is now applied on all selectors.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.
-   The styles of selectors and text fields are not agreed. This is part of the migration process of the elements from MDC 3.2.0 to MDC 4.0.0.
-   Disabled options in some selectors are selectable, which may cause an internal error and damage your line configuration.
    -   Workaround: Avoid selecting disabled options.

## 0.7 (29 Oct 2019)

### New Features

-   New themes from numerous cities are available: Dongguan, Kaohsiung, Macau, New Taipei, San Francisco, Shanghai, Taipei, Tokyo.
-   You can now customise the padding size of the line to avoid long station names overflow.

### Known Issues

-   Sliders may stop working randomly. We are investigating this issue.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.

## 0.6 (28 Oct 2019)

### New Features

-   Got a ridiculously long station name (e.g. Sino-Singapore Guangzhou Knowledge City)? Now you can wrap the name by adding a backslash (`\`).
-   More templates are available now. You can design your line based on existing railway without entering all the details manually.
-   You can now export canvas as SVG. The exported SVG keeps fonts and all other information which allow you to share your work to your friends.

### Known Issues

-   Sliders may stop working if the browser window is resized while Layout tab is not focused.
-   Slider values may not be initialised correctly after importing or resetting configuration.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.

### Resolved Issues

-   Station selector now sorts options in topological ordering.
-   Fixed the issue that notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow.

## 0.5 (22 Oct 2019)

### New Features

-   More browsers are now supported.
-   Customisation of Chinese character-form is now available.
-   Material Design is applied to all setting panels.

### Known Issues

-   Station selector may not sort options in a reasonable order.
-   Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top.
-   Sliders may stop working if the browser window is resized while Layout tab is not focused.
-   Slider values may not be initialised correctly after importing or resetting configuration.
    -   Workaround: Refresh page to re-initial sliders. Your work will not be lost if you are not using incognito mode.

## 0.4 (20 Oct 2019)

### New Features

-   Adding branches is now available.
-   Setting current station is now available.
-   Exporting and importing configuration file are now available.

### Known Issues

-   Station selector may not sort options in a reasonable order.
-   Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top.
-   Sliders may stop working if the browser window is resized while Layout tab is not focused.

### Resolved Issues

-   Removing all stations from a branch no longer affects subsequent manipulations of the line.
-   Fixed the initial value of vertical position slider.

## 0.3 (18 Oct 2019)

### New Features

-   Adding stations is now available. You can now design your own railway line.

### Known Issues

-   Adding a new branch is currently not available.
    -   Workaround: Use branches provided in the template and add/edit/remove stations within these branches.
-   Removing all stations from a branch may have unexpectedly results in subsequent manipulations.
-   Station selector may not sort options in a reasonable order.
-   Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top.
-   Sliders may stop working if the browser window is resized while Layout tab is not focused.

## 0.2 (17 Oct 2019)

### New Features

-   Customisations of all fields (except adding stations) are now available!

### Known Issues

-   Notched outline and floating labels of `MDCTextField` and `MDCSelect` overflow to the top.
-   Sliders may stop working if the browser window is resized while Layout tab is not focused.

## 0.1 (15 Oct 2019)

### New Features

-   The first demo of Rail Map Generator is now online!
-   Line and stations can be automatically loaded from JSON configuration file and drawn as Scalable Vector Graphic (SVG).
-   The theme colour can be customised. Selections include colour standards from mass transport systems in Beijing, Edinburgh, Foshan, Glasgow, Guangzhou, Hong Kong, London, Shenzhen and Toronto.
-   Customisations of the train direction and platform number are available.
