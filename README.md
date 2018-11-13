# dash-table-experiments

## DEPRECATED
If you are looking for a first class data table component for Dash head on over to https://github.com/plotly/dash-table and check out the documentation https://dash.plot.ly/datatable.


## Usage ##

```
# Install 
$ pip install dash-table-experiments
```

### Usage with Callbacks ###
Per [this Dash community answer](https://community.plot.ly/t/dash-datatable-using-callbacks/6756/2), to use callbacks with `dash-table-experiments` there are two key steps (for a full working example see [usage-callback.py](./usage-callback.py)):

```
# 1. Declare the table in app.layout
dt.DataTable(
    rows=[{}], # initialise the rows
    row_selectable=True,
    filterable=True,
    sortable=True,
    selected_row_indices=[],
    id='datatable'
)

# 2. Update rows in a callback
@app.callback(Output('datatable', 'rows'), [Input('field-dropdown', 'value')])
def update_datatable(user_selection):
    """
    For user selections, return the relevant table
    """
    if user_selection == 'Summary':
        return DATA.to_dict('records')
    else:
        return SOMEOTHERDATA.to_dict('records')
```

### Usage with Graphs ###
This example demonstrates the user's ability to select data points either in the table which updates the plot, or in the reverse, select points on the graph which updates the selection on the table. For a full working example see [usage.py](./usage.py).

### Usage Enabling Edits to a Table ###
Enable edits to a table which updates other objects e.g. a graph. For a full working example see [usage-editable.py](https://github.com/plotly/dash-table-experiments/tree/master/usage-editable.py)
