from setuptools import setup
from io import open
from psyneulink_sphinx_theme import __version__

setup(
    name = 'psyneulink_sphinx_theme',
    version =__version__,
    author = 'Dillon Smith',
    author_email= 'dillon.th.smith@gmail.com',
    url="https://github.com/psyneulink/psyneulink_sphinx_theme",
    docs_url="https://github.com/psyneulink/psyneulink_sphinx_theme",
    description='PsyNeuLink Sphinx Theme',
    py_modules = ['psyneulink_sphinx_theme'],
    packages = ['psyneulink_sphinx_theme'],
    include_package_data=True,
    zip_safe=False,
    package_data={'psyneulink_sphinx_theme': [
        'theme.conf',
        '*.html',
        'static/css/*.css',
        'static/js/*.js',
        'static/js/*/*.js',
        'static/fonts/*.*',
        'static/fonts/*/*.*',
        'static/images/*.*',
        'theme_variables.jinja'
    ]},
    entry_points = {
        'sphinx.html_themes': [
            'psyneulink_sphinx_theme = psyneulink_sphinx_theme',
        ]
    },
    license= 'MIT License',
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Environment :: Web Environment",
        "Intended Audience :: Developers",
        "Intended Audience :: System Administrators",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Topic :: Internet",
        "Topic :: Software Development :: Documentation"
    ],
    install_requires=[
       'sphinx'
    ]
)
