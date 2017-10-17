# -*- coding: UTF-8 -*-

import dash
from dash.dependencies import Input, Output, State
import dash_core_components as dcc
import dash_html_components as html
import dash_table_experiments as dt
import json
import pandas as pd
import plotly

app = dash.Dash()

app.scripts.config.serve_locally = True

DF_GAPMINDER = pd.read_csv(
    'https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv'
)
sparklines = {
    c: html.Div(style={'height': 100, 'width': '100%'}, children=dcc.Graph(
        id=c,
        figure={
            'data': [{
                'x': DF_GAPMINDER[c],
                'type': 'histogram'
            }],
            'layout': {
                'height': 100,
                'width': 150,
                'margin': {
                    'l': 0, 'r': 0, 't': 0, 'b': 0
                },
                'xaxis': {
                    'showticklabels': False,
                    'showline': False,
                    'showgrid': False,
                },
                'yaxis': {
                    'showticklabels': False,
                    'showline': False,
                    'showgrid': False,
                }
            }
        },
        config={'displayModeBar': False}
    ))
    for c in DF_GAPMINDER.columns
}

app.layout = html.Div([
    html.H1('💖 Dash Sparklines 💖', style={'textAlign': 'center'}),
    html.H2(html.I('Coming Soon'), style={'textAlign': 'center'}),
    dt.DataTable(
        rows=[sparklines] + DF_GAPMINDER.to_dict('records'),
        id='table',
        min_height=1500,
    ),
    html.Div(dcc.Dropdown(), style={'display': 'none'})
], className="container")


app.css.append_css({
    "external_url": "https://codepen.io/chriddyp/pen/bWLwgP.css"
})

if __name__ == '__main__':
    app.run_server(debug=True, port=8060)
