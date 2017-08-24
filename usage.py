import dash
import dash_core_components as dcc
import dash_html_components as html
import dash_table_experiments as dt
import json
import pandas as pd
import numpy as np

app = dash.Dash()

app.scripts.config.serve_locally=True

DF_WALMART = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/1962_2006_walmart_store_openings.csv')

app.layout = html.Div([
    html.H4('DataTable'),
    dt.DataTable(
        dataframe=DF_WALMART.to_dict('split'),
        filterable=True,
        sortable=True
    )
])

if __name__ == '__main__':
    app.run_server(debug=True)
