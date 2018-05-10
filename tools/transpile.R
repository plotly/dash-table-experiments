if (!require(dashRtranspile)) remotes::install_github("plotly/dashRtranspile")

library(dashRtranspile)
transpile_write(transpile())
