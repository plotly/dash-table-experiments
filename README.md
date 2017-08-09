# dash-table-experiments

What does a Dash Table component look like? `dash-table-experiments` is a package of alpha-level explorations in a Dash `Table` component. Everything is subject to change. See the [CHANGELOG.md](https://github.com/plotly/dash-table-experiments/blob/master/CHANGELOG.md) for recent changes.

The Dash Table component will likely be merged into the [`dash-core-components`](https://github.com/plotly/dash-core-componets) once it stabilizes.

## Usage

![editable-table](https://user-images.githubusercontent.com/1280389/29104340-daa2f7ec-7c92-11e7-81bc-ac45e34bd21f.gif)

```
$ pip install dash-table-experiments
```

```python
import dash
import dash_core_components as dcc
import dash_html_components as html
import dash_table_experiments as dt
import pandas as pd

app = dash.Dash()

app.scripts.config.serve_locally=True

DF_INITIAL = pd.DataFrame({
    'Column 1': [1, 2, 3],
    'Column 2': [1, 19, 10],
    'Column 3': [3, 1, 2],
})

app.layout = html.Div([
    dt.EditableTable(
        id='editable-table',
        editable=True,
        dataframe=DF_INITIAL.to_dict(),

        # Optional attributes
        column_order=DF_INITIAL.columns,
        merged_styles={
            'td': {
                'border': 'thin lightgrey solid'
            }
        },
        index_name='Index',
        types={
            'Column 1': 'numeric',
            'Column 2': 'numeric',
            'Column 3': 'numeric'
        }
    ),

    dcc.Graph(id='my-graph'),

])


@app.callback(
    dash.dependencies.Output('my-graph', 'figure'),
    [dash.dependencies.Input('editable-table', 'dataframe')])
def update_graph(dataframe_dict):
    df = pd.DataFrame(dataframe_dict)
    return {
        'data': [{
            'x': df.index,
            'y': df[c],
            'mode': 'lines+markers',
            'marker': {'size': 12},
            'line': {'width': 4},
            'name': c
        } for c in df.columns]
    }

if __name__ == '__main__':
    app.run_server(debug=True)
```

