var canvas_width = 1200;
var canvas_height = 800;

//padding around the entire plot
var padding = 60;

var label_font_size = 10;

////data field names for mapping the color to each point.
//color field name from the 'stuides'
var color_gwas_field = 'color'
//GWAS id field name from the original dataframe
var data_gwas_id_for_color = 'GWAS'
//GWAS is field name from the 'studies'. Should match values from the 'data_gwas_id_for_color' above. 
var studies_gwas_id_for_color = 'short_name'


//used for the tooltip. Maps text to display to the actual name of the data in the dataset. So "'rsid':'RSID'" will show something like "rsid: rs123456" in the tooltip.
var tooltipMap = {
  "risd":"RSID",
  "chr:bp":"CHR_BP",
  "effect allele": "EFFECT_ALLELE",
  "other allele": "OTHER_ALLELE",
  "GWAS": "GWAS_ref",
  "nearest gene": "NEAR_GENE",
  "effect allele freq (European)": "EFFECT_FREQ_NALLS",
  "effect allele freq (African)": "AF_afr",
  "effect allele freq (East Asian)": "AF_eas",
  "beta (Nalls et al.)":"BETA_NALLS",
  "odds ratio (Nalls et al.)": "OR_NALLS",
  "beta (Foo et al.)": "BETA_FOO",
  "odds ratio (Foo et al.)": "OR_FOO",
  "p-value":"P_GWAS"
}

//maps the x_to_use variable values to a x label name. 
var xLabelMap = {
  "AF_eas": "East Asian Effect Allele Frequency",
  "AF_afr": "African Effect Allele Frequency",
  "EFFECT_FREQ_NALLS":"European Effect Allele Frequency"
}

//maps the y_to_use variable values to a y label name. 
var yLabelMap = {
  "BETA_FOO": "Foo et al. 2020 Beta",
  "OR_FOO": "Foo et al. 2020 Odds Ratio",
  "BETA_NALLS": "Nalls et al. 2019 Beta",
  "OR_NALLS": "Nalls et al. 2019 Odds Ratio"
  
}

//a data field that is unique to each variant in the data.
var variantIdField = "RSID"        
//array of fields to search for when using the search bar.
var searchFields = ["RSID","CHR_BP","NEAR_GENE"]


//X position of the legend
var legendX = canvas_width - padding *2 - 10;
//Y position of the legend
var legendY = 30;

var legendFontSize = '15px'
//padding for the box around the text
var legend_padding = 15;
        