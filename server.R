
shinyServer(function(input, output,session) {
  #setup the data variables and update the inputs
  source("datafields.R", local = T)
  updateUI(session, input, output)
  
  #starting animation
  shinyjs::show("splashLogo")
  startAnim(session,
            id = "splashLogo",
            type = "flipInX")
  
  #read data
  data <- fread("www/risk_variant_data.csv")

  #show the uiPage after animation
  delay(1000,
        {
          shinyjs::show("uiPage")
          shinyjs::hide("splashPage")
        }
  )
  
  
  #collect data and variables to pass to the plot.js update function when any of the inputs are changed.
  observeEvent({input$y_input
    input$y_study_input
    input$log_input
    input$gwas_buttons
    input$annotation_input
    input$population_input
    input$canvas_height
    input$canvas_width
    input$legend_input},ignoreNULL = FALSE,
    {
      #make sure none of these are empty
      if(input$population_input!="" & !is.null(input$y_input) & !is.null(input$y_study_input))
      {
        #plot_df will hold the information we will display, filtered by the selected GWASes.
        plot_df <- data[which(data$GWAS %in% input$gwas_buttons)]
        
        #canvas dimensions
        canvas_width <- input$canvas_width
        canvas_height <- input$canvas_height
  
        #update y value text
        output$y_stats_output <- renderText(paste0(input$y_input," values taken from ",studies[studies$short_name==input$y_study_input,]$ref,". Variants with no ",input$y_input," are removed."))
        
        #get the y value to use based on the "Y Axis Values:" and "Beta/Odds Ratio From:" selectors.
        y_to_use <- as.vector(unlist(effect_size_values[paste0(input$y_input,"_",input$y_study_input)]))[1]
      
     
        #population from "X Axis Effect Allele Frequency:" selector.
        x_to_use <- input$population_input
  
        
  
        #mess around with json conversions to get it formatted correctly to pass to the javascript function
        pdjson <- jsonlite::toJSON(plot_df)
        pdlist <- rjson::fromJSON(pdjson)
        
        studiesjson  <- jsonlite::toJSON(studies)
        studieslist <- rjson::fromJSON(studiesjson)
  
        
        pdfulllist <<- list(legend = input$legend_input, log_y = input$log_input, annotation=input$annotation_input,y_to_use=y_to_use,x_to_use=x_to_use, canvas_height = canvas_height, canvas_width = canvas_width,points=pdlist, studies = studieslist)
        finalpdjson <- rjson::toJSON(pdfulllist)
  
  
        #pass all the data and other variables to the javascript update function. 
        runjs(paste0("update(",finalpdjson,")"))
      }

      
    })
  

})



