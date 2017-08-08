from setuptools import setup

exec (open('dash_table_experiments/version.py').read())

setup(
    name='dash_table_experiments',
    version=__version__,
    author='plotly',
    packages=['dash_table_experiments'],
    include_package_data=True,
    license='MIT',
    description='Dash table experiments',
    install_requires=[]
)
