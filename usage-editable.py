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


DF_SIMPLE = pd.DataFrame({
    'x': ['A', 'B', 'C', 'D', 'E', 'F'],
    'y': [4, 3, 1, 2, 3, 6],
    'z': ['a', 'b', 'c', 'a', 'b', 'c']
})


app.layout = html.Div([
    html.H4('Editable DataTable'),
    dt.DataTable(
        rows=DF_SIMPLE.to_dict('records'),

        # optional - sets the order of columns
        columns=sorted(DF_SIMPLE.columns),

        editable=True,

        id='editable-table'
    ),
    html.Div([
        html.Pre(id='output', className="two columns"),
        html.Div(
            dcc.Graph(
                id='graph',
                style={
                    'overflow-x': 'wordwrap'
                }
            ),
            className="ten columns"
        )
    ], className="row")
], className="container")


@app.callback(
    Output('output', 'children'),
    [Input('editable-table', 'rows')])
def update_selected_row_indices(rows):
    return json.dumps(rows, indent=2)


@app.callback(
    Output('graph', 'figure'),
    [Input('editable-table', 'rows')])
def update_figure(rows):
    dff = pd.DataFrame(rows)
    return {
        'data': [{
            'x': dff['x'],
            'y': dff['y'],
        }],
        'layout': {
            'margin': {'l': 10, 'r': 0, 't': 10, 'b': 20}
        }
    }


app.css.append_css({
    "external_url": "https://codepen.io/chriddyp/pen/bWLwgP.css"
})

if __name__ == '__main__':
    app.run_server(debug=True)
