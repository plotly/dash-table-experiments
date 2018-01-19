# Change Log for dash-table-experiments
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.5.5
### Fixed
- Fixed existing filter strings not resetting when a Dash callback changes the dataset displayed in the dash-table.

## 0.5.4
### Fixed
- Fixed issue with `min_height` regarding the `DataTable` under 10 rows.
- Fixed issue with `filter` bar under 2 rows. Before, if there was only one row of data and the user clicked on 'Filter' the data would disappear. To improve the UI, if there is only one row additional height is added to the table div element so the user can still see the data if the 'Filter' button is selected.

## 0.5.3
### Added
- A `resizable` property on the `DataTable` component. If `True`, then the columns
can be resized by clicking and dragging on the border on the edge of the column
header. If `False`, they cannot be resized. By default, columns are resizable.

## 0.5.2
### Added
- A `column_widths` property can be used to set the column widths of the
`DataTable`. Simple example:
```python
ROWS = [
    {'a': 'AA', 'b': 1},
    {'a': 'AB', 'b': 2},
]

dt.DataTable(
    rows=ROWS,
    columns=['a', 'b'],
    column_widths=[200, 400]
)
```

## 0.5.1
### Added
- `DataTable` now automatically resizes to fit data that has less than 10 rows.

## 0.5.0
### Added
- `filterable=True`, `sortable=True`, and `row_selectable=True` all work well with each other
- `<`, `<=`, `>`, `>=` are supported as filter strings

## 0.4.0
Bad release!

## 0.3.0
### Added
- 🎉 `DataTable` rows can be selected with `row_selectable=True` and by listening to the `selected_rows` property.

## 0.2.3
### Fixed
- Fixed the CSS on `DataTable`. It looks a lot better now.

## 0.2.2 - 2017-09-06
- This release was broken

## 0.2.1 - 2017-09-06
### Added
- A `columns` property to the `DataTable` that specifes the order of the columns

## 0.2.0 - 2017-08-24
### Added
- Callbacks to the `DataTable` component

## 0.1.0 - 2017-08-23
### Added
- The `DataTable` is now `sortable` and `filterable`


## 0.0.3 - 2017-08-23
### Added
- A DataTable component which uses the adazzle React Data Grid

## 0.0.2 - 2017-08-08
- Initial release
