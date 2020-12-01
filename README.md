# PD Genetic Landscape Plot 
- **Author(s)** - Frank Grenn
- **Date Started** - August 2020
- **Quick Description:** - R shiny application that takes in a specifically formatted csv file containing Parkinson's disease (or any other disease you have data for) summary statistics and plots variants by their effect sizes and frequencies. 

## File Overview
* ui.R - code for user interface layout.
* server.R - code for server logic.
* global.R - library imports.
* datafields.R - contains code to initialize some of the user interface. Also contains variables used to modify what the inputs display. 
* risk_variant_data.ipynb - notebook containing code used to organize the main input file (`risk_variant_data.csv`) for this tool.
* www/labeler.js - code used to space the annotations on the plot.
* www/plot.js - code used to generate the plot.
* www/setup.js - contains variables that control display and the data the plot uses.
* www/risk_variant_data.csv - file containing all data to be displayed in the plot. Generated in `risk_variant_data.ipynb`. 
* www/theme.css - css to format and style the display.

## Making Changes
Some things to consider if modifying this tool yourself.

##### 1) All data comes from `www/risk_variant_data.csv`
* this is read into the tool in `server.R`
* each row in this file contains a significant PD variant.
* ideally this file should at least contain columns for:
  * a unique identifier (rsid, chrbp, etc)
  * a frequency (MAF, effect allele frequency, etc)
  * an effect size (beta, odds ratio, etc)
* if you are changing this file, you will likely need to update `datafields.R` and `www/setup.js` (see steps below).

##### 2) Input options can be changed in `datafields.R`
* the options for all inputs come from lists and dataframes initialized in this file. 
* They are used to map names displayed by the input to actual field names used in the input .csv (ex: displayed "nearest gene" will use the field "NEAR_GENE" in the input .csv)

##### 3) Plot display and additional data options can be changed in `www/setup.js`
* contains variables used for display, like the size of the plot and what to include in the tooltip.
* also contains objects used to map names to data fields.