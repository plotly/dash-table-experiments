import base64
from datetime import datetime
import io
import itertools
import os
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import sys
from textwrap import dedent
import time
try:
    from urlparse import urlparse
except ImportError:
    from urllib.parse import urlparse

import dash
from dash.dependencies import Input, Output, State
import dash_html_components as html
import dash_core_components as dcc
import dash_table_experiments as dt

from .IntegrationTests import IntegrationTests
from .utils import assert_clean_console

DF_SIMPLE = pd.DataFrame({
    'x': ['A', 'B', 'C', 'D', 'E', 'F'],
    'y': [4, 3, 1, 2, 3, 6],
    'z': ['a', 'b', 'c', 'a', 'b', 'c']
})
ROWS = DF_SIMPLE.to_dict('records')


class Tests(IntegrationTests):
    def setUp(self):
        pass

    def wait_for_element_by_css_selector(self, selector):
        start_time = time.time()
        while time.time() < start_time + 20:
            try:
                return self.driver.find_element_by_css_selector(selector)
            except Exception as e:
                pass
            time.sleep(0.25)
        raise e

    def wait_for_text_to_equal(self, selector, assertion_text):
        start_time = time.time()
        while time.time() < start_time + 20:
            el = self.wait_for_element_by_css_selector(selector)
            try:
                return self.assertEqual(el.text, assertion_text)
            except Exception as e:
                pass
            time.sleep(0.25)
        raise e

    def snapshot(self, name):
        if 'PERCY_PROJECT' in os.environ and 'PERCY_TOKEN' in os.environ:
            python_version = sys.version.split(' ')[0]
            print('Percy Snapshot {}'.format(python_version))
            self.percy_runner.snapshot(name=name)

    def test_render_table(self):
        app = dash.Dash()
        app.layout = html.Div([
            html.Div(id='waitfor'),
            html.Label('Default'),
            dt.DataTable(
                rows=ROWS
            ),

            html.Label('Editable'),
            dt.DataTable(
                rows=ROWS,
                editable=True
            ),

            html.Label('Filterable'),
            dt.DataTable(
                rows=ROWS,
                filterable=True
            ),

            html.Label('Sortable'),
            dt.DataTable(
                rows=ROWS,
                sortable=True
            ),

            html.Label('Resizable'),
            dt.DataTable(
                rows=ROWS,
                filterable=True
            ),

            html.Label('Column Widths'),
            dt.DataTable(
                rows=ROWS,
                column_widths=[30, 100, 80]
            ),

            html.Label('Columns'),
            dt.DataTable(
                rows=ROWS,
                columns=['y', 'x', 'z']
            ),

            html.Label('Row Selectable'),
            dt.DataTable(
                rows=ROWS,
                row_selectable=True
            ),

            html.Label('Selected Indices'),
            dt.DataTable(
                rows=ROWS,
                selected_row_indices=[2]
            ),

            html.Label('Header Row Height'),
            dt.DataTable(
                rows=ROWS,
                header_row_height=100
            ),

            html.Label('Min Height'),
            dt.DataTable(
                rows=ROWS,
                min_height=600
            ),

            html.Label('Min Width'),
            dt.DataTable(
                rows=ROWS,
                min_width=400
            ),

            html.Label('Row Height'),
            dt.DataTable(
                rows=ROWS,
                row_height=200
            )
        ])

        self.startServer(app)
        self.wait_for_element_by_css_selector('#waitfor')
        self.snapshot('gallery')
        assert_clean_console(self)

    def test_update_rows_from_callback(self):
        app = dash.Dash()
        app.layout = html.Div([
            html.Button(
                children='load',
                id='button',
                n_clicks=0
            ),
            dt.DataTable(
                id='dt',
                rows=[{}]
            )
        ])

        @app.callback(Output('dt', 'rows'),
                      [Input('button', 'n_clicks')])
        def update_rows(n_clicks):
            if n_clicks > 0:
                return ROWS
            else:
                return [{}]

        self.startServer(app)

        self.snapshot('test_update_rows_from_callback-1')
        self.wait_for_element_by_css_selector('#button').click()
        time.sleep(5)
        self.snapshot('test_update_rows_from_callback-2')

    def test_height(self):
        def gen_rows(length):
            return [
                {'a': 'AA', 'b': i} for i in range(length)
            ]

        options = {
            'row': [
                ['single row', gen_rows(1)],
                ['five rows', gen_rows(5)],
                ['ten rows', gen_rows(10)],
                ['thirty rows', gen_rows(30)]
            ],
            'min_height': [
                ['none', None],
                ['800', 800],
                ['200', 200]
            ],
            'filterable': [
                ['true', True],
                ['false', False]
            ],
            'row_height': [
                ['none', None],
                ['20', 20],
                ['50', 50]
            ],
            'max_rows_in_viewport': [
                ['none', None],
                ['2', 2],
                ['15', 15]
            ]
        }

        layout = []
        for opt in itertools.product(options['row'],
                                     options['min_height'],
                                     options['filterable'],
                                     options['row_height'],
                                     options['max_rows_in_viewport']):
            kwargs = {'rows': opt[0][1], 'filterable': opt[2][1]}
            if opt[1][1] is not None:
                kwargs['min_height'] = opt[1][1]
            if opt[3][1] is not None:
                kwargs['row_height'] = opt[3][1]
            if opt[4][1] is not None:
                kwargs['max_rows_in_viewport'] = opt[4][1]
            layout.extend([
                html.H3(
                    '''
                        {},
                        min_height={},
                        filterable={},
                        row_height={},
                        max_rows={}
                    '''.format(
                            *[o[0] for o in opt]
                    )),
                dt.DataTable(**kwargs)
            ])

        app = dash.Dash()
        app.layout = html.Div(layout + [html.Div(id='waitfor')])

        self.startServer(app)
        self.wait_for_element_by_css_selector('#waitfor')
        self.snapshot('heights')
