# dash-table-experiments

What does a Dash Table component look like? `dash-table-experiments` is a package of alpha-level explorations in a Dash `Table` component. Everything is subject to change. See the [CHANGELOG.md](https://github.com/plotly/dash-table-experiments/blob/master/CHANGELOG.md) for recent changes.

The Dash Table component will likely be merged into the [`dash-core-components`](https://github.com/plotly/dash-core-components) once it stabilizes.

For updates and more, please see the [dash community discussion on tables](https://community.plot.ly/t/display-tables-in-dash/4707/36).

Example from `usage.py`
![Dash DataTable](https://github.com/plotly/dash-table-experiments/raw/master/images/DataTable.gif)

Example from `usage-editable.py`
![Editable Dash DataTable](https://github.com/plotly/dash-table-experiments/raw/master/images/Editable-DataTable.gif)


## Usage

```
$ pip install dash-table-experiments
```

### Usage with Callbacks
Per [this Dash community answer](https://community.plot.ly/t/dash-datatable-using-callbacks/6756/2), to use callbacks with `dash-table-experiments`:

```

# declare the table in app.layout
dt.DataTable(
    rows=[{}], # initialise the rows
    row_selectable=True,
    filterable=True,
    sortable=True,
    selected_row_indices=[],
    id='datatable'
)

# update rows in a callback
@app.callback(Output('datatable', 'rows'), [Input('field-dropdown', 'value')])
def update_datatable(user_selection):
    '''
    For user selections, return the relevant table
    '''
    if user_selection == 'Summary':
        return DATA.to_dict('records')
    else:
        return SOMEOTHERDATA.to_dict('records')
```

See [usage.py](https://github.com/plotly/dash-table-experiments/tree/master/usage.py) and
See [usage-editable.py](https://github.com/plotly/dash-table-experiments/tree/master/usage-editable.py)
