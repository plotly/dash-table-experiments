library(dasher)

gapminder <- read.csv(
  'https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv'
)
gapminder <- gapminder[gapminder$year == 2007, ]

app <- Dash$new()

app$layout_set(htmlDiv(
  className = "container",
  htmlH4('Gapminder 2007 DataTable'),
  dashTable::DataTable(
    rows = gapminder,
    # optional - sets the order of columns
    columns = setdiff(names(gapminder), "year"),
    editable = FALSE,
    row_selectable = TRUE,
    filterable = TRUE,
    id = 'datatable-gapminder' 
  ),
  htmlDiv(id = 'selected-indexes'),
  coreGraph(
    id = 'graph-gapminder'
  )
))


app$callback(
  function(selectedData = input('graph-gapminder', 'selectedData'), 
           selected_rows = state('datatable-gapminder', 'selected_row_indices')) {
    
    if (length(selectedData)) {
      countries <- selectedData$points[[1]]$customdata
      row_idx <- which(gapminder$country %in% countries)
      selected_rows <- unique(c(row_idx, unlist(selected_rows)))
    }
    
    selected_rows
    
  }, output('datatable-gapminder', 'selected_row_indices')
)

app$callback(
  function(rows = input('datatable-gapminder', 'rows'), 
           selected_rows = input('datatable-gapminder', 'selected_row_indices')) {
    
    g <- gapminder[gapminder$country %in% rows[[1]]$country, ]
    colors <- rep("black", nrow(g))
    row_idx <- unlist(selected_rows)
    if (length(row_idx)) colors[row_idx] <- "red"
    
    
    list(
      data = list(list(
        x = g$gdpPercap,
        y = g$lifeExp,
        text = g$country,
        customdata = g$country,
        mode = "markers",
        marker = list(color = colors)
      )),
      layout = list(
        title = "Click and drag to select countries (i.e., rows)",
        xaxis = list(title = "GDP Per Capita"),
        yaxis = list(title = "Life Expectancy"),
        dragmode = "select"
      )
    )
    
  }, output('graph-gapminder', 'figure')
)

app$dependencies_set(dash_css())
app$run_server(showcase = TRUE)
