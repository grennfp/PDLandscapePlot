#initialize inputs based on values at the bottom of this file
updateUI <- function(session, input, output){
  
  gwas_choiceNames <- list()
  for (row in 1:nrow(studies)) {
    line <- paste0(studies[row,"name"], " (<a href='", studies[row,"link"], "' target='_blank'>", studies[row,"ref"],"</a>)")
    gwas_choiceNames[row] <- list(HTML((line)))

  }

  updateCheckboxGroupInput(session, "gwas_buttons", label  = "",choiceNames =  gwas_choiceNames, choiceValues = studies$short_name,
                           selected = studies$short_name[1])
  
  
  updateRadioGroupButtons(session, "population_input", label ="X Axis Effect Allele Frequency:",choiceNames = as.vector(populations$name),
                         choiceValues = as.vector(populations$data_name),selected = as.vector(populations$data_name)[1], status = "primary")
  
  updateRadioGroupButtons(session, "y_input", label ="Y Axis Values:", choices = as.vector(effect_sizes$name),
                          selected = as.vector(effect_sizes$name)[1], status = "primary")
  
  updateRadioGroupButtons(session, "y_study_input", label ="Beta/Odds Ratio From:",      choiceNames = as.vector(effect_size_studies$name),
                          choiceValues = as.vector(effect_size_studies$short_name),selected = as.vector(effect_size_studies$short_name)[1], status = "primary")
  
  updateRadioGroupButtons(session, "annotation_input", choiceNames = as.vector(annotation_values$name),
                          choiceValues = as.vector(annotation_values$data_name),selected = "none", status = "primary")
}


#################################################
##########INPUT AND MAPPING VARIABLES############
#################################################

#GWAS data used for the "GWAS" checkboxes. 
#"name" is the text to be displayed
#"ref" is short reference text used for the hyperlink text and also by the "Beta/Odds Ratio From:" selector.
#"link" is a hyperlink to pubmed for the study.
#"short_name" is some shortened version of the study used elsewhere in this tool. 
#"color" are colors for the points from the GWAS on the plot.
studies <- data.frame(
  name =c("PD Risk European","PD Progression","PD Risk Asian"),
  ref = c("Nalls et al. 2019","Iwaki et al. 2019", "Foo et al. 2020"),
  link =c('https://pubmed.ncbi.nlm.nih.gov/31701892/', 'https://pubmed.ncbi.nlm.nih.gov/31505070/', 'https://pubmed.ncbi.nlm.nih.gov/32310270/'),
  short_name =c("META5", "Progression", "Asian"),
  color = c("#3182bd","#a1d99b","#e6550d"),
  check.names = FALSE
)

#names of the populations to include in the "X Axis Effect Allele Frequency:" selector. "name" is the value displayed and "data_name" is the column value in the data. 
populations <- data.frame(
  name = c("European", "Asian", "African"),
  data_name = c("EFFECT_FREQ_NALLS","AF_eas","AF_afr"),
  check.names = FALSE
)

#names of the effect size type to include in the "Y Axis Values:" selector
effect_sizes <- data.frame(
  name = c("beta", "odds ratio"),
  check.names = FALSE
)

#names of the fields to use for the annotations selector. "name" is the value displayed and "data_name" is the column value in the data (except for "none"). 
annotation_values <- data.frame(
  name = c("none","rsid","nearest gene"),
  data_name = c("none","RSID","NEAR_GENE"),
  check.names = FALSE
)

#names of the effect size studies to include in the "Beta/Odds Ratio From:" selector.
#These should be taken straight from the "studies" dataframe above. 
effect_size_studies <- data.frame(
  name = c("Nalls et al. 2019", "Foo et al. 2020"),
  short_name =c("META5", "Asian"),
  check.names = FALSE
)

#the field we use for the y axis is a combination of the chosen effect size and study, 
#so map a combination of the above "effect_sizes" dataframe and "effect_size_studies" dataframe to the actual column names in the data.
effect_size_values <- list("beta_META5" = "BETA_NALLS","odds ratio_META5"="OR_NALLS","beta_Asian" ="BETA_FOO", "odds ratio_Asian"= "OR_FOO")


