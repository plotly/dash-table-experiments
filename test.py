import dash_table_experiments
import dash

app = dash.Dash('')

app.layout = dash_table_experiments.ExampleComponent(label='My label')

app.scripts.config.serve_locally = True

if __name__ == '__main__':
    app.run_server(debug=True)
