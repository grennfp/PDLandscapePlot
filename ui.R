
shinyUI( tagList(fluidPage(
  shinyjs::useShinyjs(),
  withAnim(),
  tags$head(includeCSS("www/theme.css")),
  div(
    id = "splashPage",
    hidden(img(src = "logos/LandscapePlot_IPDGC_logo.png", id = "splashLogo"))
  ),
  hidden(
    div(id = "uiPage",
        dashboardPagePlus(    
          title = "PD Genetic Landscape Plot", skin = "black",
          dashboardHeaderPlus(
            title = tagList(actionLink("wrapperLogo", span(img(src = "logos/LandscapePlot_IPDGC_logo.png", id = "wrapperLogo", width = "60%"),style="display: inline; position: relative; top: 0px; color: #0a3a87"))),
            left_menu = tagList(
              fluidRow(
                column(
                  div(
                    #searchbar code in plot.js
                    searchInput("searchInputBar", placeholder = "rs114138760, PMVK, 1:154898185", btnSearch = icon("search"),btnReset  = icon("remove"), width = "425px" )
                  ),
                  width = 12
                )
              )
            ),
            tags$li(class = "dropdown", actionBttn(
              inputId = "download_button",
              label = "Download Plot", 
              style = "material-flat",
              color = "primary"
            ))
          ),
          dashboardSidebar(
            width = 400,
            
            tabsetPanel(type = "tabs",
                        tabPanel("Data", 
                                 div(class="tabpanel",
                                     
                                     boxPlus(
                                       checkboxGroupInput(
                                         inputId = "gwas_buttons",
                                         label = ""
                                       ),
                                       status = "primary",
                                       solidHeader = T,
                                       closable = F,
                                       width = 12,
                                       title = "GWAS",
                                       footer = "Include variants from selected genome wide association studies (GWAS)."
                                     ),
                                     boxPlus(
                                       status = "primary",
                                       solidHeader = T,
                                       closable = F,
                                       width = 12,
                                       title = "Axes",
                                       footer = div(uiOutput(outputId = "stats_output"),uiOutput(outputId = "y_stats_output")),
                                       radioGroupButtons(
                                         inputId = "population_input",
                                         label = "X Axis Effect Allele Frequency:",
                                         choices=c("")
                                       ),
                                       checkboxInput(inputId = "log_x_input", label = "log scale x-axis",value=TRUE),
                                       radioGroupButtons(
                                         inputId = "y_input",
                                         label = "Y Axis Values:", 
                                         choices = c("")
                                       ),
                                       radioGroupButtons(
                                         inputId = "y_study_input",
                                         label = "Beta/Odds Ratio From:", 
                                         choices = c("")
                                       ),
                                       checkboxInput(inputId = "log_y_input", label = "log scale y-axis",value=TRUE)
                                       
                                     )
                                     
                                     
                                 )
                        ),
                        tabPanel("Display", 
                                 boxPlus(
                                   status = "primary",
                                   solidHeader = T,
                                   closable = F,
                                   width = 12,
                                   title = "Annotation",
                                   footer = "",
                                   radioGroupButtons(
                                     inputId = "annotation_input",
                                     choices = c("")
                                   )
                                 ),
                                 boxPlus(
                                   status = "primary",
                                   solidHeader = T,
                                   closable = F,
                                   width = 12,
                                   title = "Legend",
                                   footer = "",
                                   materialSwitch(
                                     inputId = "legend_input",
                                     label = "include legend", 
                                     value = FALSE,
                                     status = "primary",
                                     right = TRUE
                                   )
                                 ),
                                 boxPlus(
                                   status = "primary",
                                   solidHeader = T,
                                   closable = F,
                                   width = 12,
                                   title = "Dimensions",
                                   footer = "",
                                   sliderInput("canvas_width", label = "canvas_width:",
                                               min = 300, max = 2000, value = 1200, step =100),
                                   sliderInput("canvas_height", label = "canvas_height:",
                                               min = 300, max = 1000, value = 800, step =100)
                                 ),
                                 boxPlus(
                                   status = "primary",
                                   solidHeader = T,
                                   closable = F,
                                   width = 12,
                                   title = "Grouping",
                                   footer = "Only color variants in a certain range.",
                                   sliderInput("x_axis_range", label = "X Axis:",
                                               min = 0, max = 1, value = c(0,1), step =0.025),
                                   sliderInput("y_axis_range", label = "Y Axis:",
                                               min = -100, max = 100, value = c(-100,100), step =0.025)
                                 )
                                 
                                 
                                 
                        )
            )
            
            
            
            
          ),
          sidebar_fullCollapse = TRUE,
          dashboardBody(
            fluidRow(
              column(width = 12, style = "overflow-x: scroll", 
                     div(id="my_dataviz",style=("height:1000px"))
              )
            )
            
          ))
    )
  ),
  tags$script(src = "https://d3js.org/d3.v6.js"),
  tags$script(src = "labeler.js"),
  tags$script(src = "setup.js"),
  tags$script(src = "plot.js")
)
))