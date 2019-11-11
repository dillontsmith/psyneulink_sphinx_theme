# PsyNeuLink Sphinx Theme

Sphinx theme for [PsyNeuLink Docs](https://psyneulink.org/docs/master/torch.html) and [PsyNeuLink Tutorials](https://psyneulink.org/tutorials) based on the [Read the Docs Sphinx Theme](https://sphinx-rtd-theme.readthedocs.io/en/latest).

## Local Development

Run python setup:

```
python setup.py install
```

and install the dependencies using `pip install -r docs/requirements.txt`

In the root directory install the `package.json`:

```
# node version 8.4.0
yarn install

```

If you have `npm` installed then run:

```
npm install
```

- If you want to see generated documentation for `docs/demo` then create
`.env.json` file and make it empty json file. Means `.env.json file` will
contain

```
{}
```

Run grunt to build the html site and enable live reloading of the demo app at `localhost:1919`:

```
grunt
```

- If you want to specify the project folder (docs or tutorial for which
you want to see docs generated) then you need to specify it into `.env.json`
file:

```
{
    "DOCS_DIR": "docs/",
    "TUTORIALS_DIR": "path/to/tutorial/directory"
}
```

Run grunt to build the html site for docs:

```
grunt --project=docs
```

and to build the html site for tutorial:

```
grunt --project=tutorials
```

The resulting site is a demo.

## Testing your changes and submitting a PR

When you are ready to submit a PR with your changes you can first test that your changes have been applied correctly against either the PsyNeuLink Docs or Tutorials repo:

1. Run the `grunt build` task on your branch and commit the build to Github.
2. In your local docs or tutorials repo, remove any existing `psyneulink_sphinx_theme` packages in the `src` folder (there should be a `pip-delete-this-directory.txt` file there)
3. In `requirements.txt` replace the existing git link with a link pointing to your commit or branch, e.g. `-e git+git://github.com/{ your repo }/psyneulink_sphinx_theme.git@{ your commit hash }#egg=psyneulink_sphinx_theme`
4. Install the requirements `pip install -r requirements.txt`
5. Remove the current build. In the docs this is `make clean`, tutorials is `make clean-cache`
6. Build the static site. In the docs this is `make html`, tutorials is `make html-noplot`
7. Open the site and look around. In the docs open `docs/build/html/index.html`, in the tutorials open `_build/html.index.html`

If your changes have been applied successfully, remove the build commit from your branch and submit your PR.

## Publishing the theme

Before the new changes are visible in the theme the maintainer will need to run the build process:

```
grunt build
```

Once that is successful commit the change to Github.

### Developing locally against PsyNeuLink Docs and Tutorials

To be able to modify and preview the theme locally against the PsyNeuLink Docs and/or the PsyNeuLink Tutorials first clone the repositories:

- [PsyNeuLink (Docs)](https://github.com/psyneulink/psyneulink)
- [PsyNeuLink Tutorials](https://github.com/psyneulink/tutorials)

Then follow the instructions in each repository to make the docs.

Once the docs have been successfully generated you should be able to run the following to create an html build.

#### Docs

```
# in ./docs
make html
```

#### Tutorials

```
# root directory
make html
```

Once these are successful, navigate to the `conf.py` file in each project. In the Docs these are at `./docs/source`. The Tutorials one can be found in the root directory.

In `conf.py` change the html theme to `psyneulink_sphinx_theme` and point the html theme path to this repo's local folder, which will end up looking something like:

```
html_theme = 'psyneulink_sphinx_theme'
html_theme_path = ["../../../psyneulink_sphinx_theme"]
```

Next create a file `.env.json` in the root of this repo with some keys/values referencing the local folders of the Docs and Tutorials repos:

```
{
  "TUTORIALS_DIR": "../tutorials",
  "DOCS_DIR": "../psyneulink/docs/source"
}

```

You can then build the Docs or Tutorials by running

```
grunt --project=docs
```
or

```
grunt --project=tutorials
```

These will generate a live-reloaded local build for the respective projects available at `localhost:1919`.

Note that while live reloading works these two projects are hefty and will take a few seconds to build and reload, especially the Docs.

### Built-in Stylesheets and Fonts

There are a couple of stylesheets and fonts inside the Docs and Tutorials repos themselves meant to override the existing theme. To ensure the most accurate styles we should comment out those files until the maintainers of those repos remove them:

#### Docs

```
# ./docs/source/conf.py

html_context = {
    # 'css_files': [
    #     'https://fonts.googleapis.com/css?family=Lato',
    #     '_static/css/psyneulink_theme.css'
    # ],
}
```

#### Tutorials

```
# ./conf.py

# app.add_stylesheet('css/psyneulink_theme.css')
# app.add_stylesheet('https://fonts.googleapis.com/css?family=Lato')
```

### Top/Mobile Navigation

The top navigation and mobile menu expect an "active" state for one of the menu items. To ensure that either "Docs" or "Tutorials" is marked as active, set the following config value in the respective `conf.py`, where `{project}` is either `"docs"` or `"tutorials"`.

```
html_theme_options = {
  ...
  'psyneulink_project': {project}
  ...
}
```
