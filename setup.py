from setuptools import setup

main_ns = {}
exec(open('dash_table_experiments/version.py').read(), main_ns)

setup(
    name='dash_table_experiments',
    version=main_ns['__version__'],
    author='plotly',
    packages=['dash_table_experiments'],
    include_package_data=True,
    license='MIT',
    description='Dash table experiments',
    install_requires=[]
)
