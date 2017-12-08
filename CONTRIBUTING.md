# Contributing Guide

Thanks for your interest in dash-table-experiments! Here's a quick guide to contributing to this repo.

Also, if your company or organization like to sponsor or prioritize feature development, [please reach out](https://plot.ly/products/consulting-and-oem/).

1. Create an issue and discuss the problem and notify other contributors that you will be working on the issue

2. Develop locally on a branch
```
$ git clone https://github.com/plotly/dash-table-experiments/
$ cd dash-table-experiments
$ git checkout -b your-feature
```

3. Install packages and generate the bundle
```
$ npm install
$ npm run prepublish # generates the bundle.js file and a metadata.json
```

I personally use the file watcher `entr` in combination with the file searcher `ag` to do live-reloading:
```
$ ag -l --js | entr npm run prepublish
```

4. Run an example locally
To use the local assets instead of the ones on unpkg.com, you will need to set
```
app.scripts.config.serve_locally = True
app.css.config.serve_locally = True
```

***

Other things to note
- This package uses the `adazzle` React Data Grid component: https://github.com/adazzle/react-data-grid
- There are currently no tests
- Questions? Discuss in an issue or reach out to me directly <chris@plot.ly>
