# LUNATICS GUI
This GUI will be used in order to display the results from the LUNATIC-0.

### Structure of the repo
The main code to change is within `src`. 
- `models.py` holds any models that are stored in a DB.
- `routes.py` holds any endpoint that we hit within the app. Both frontend and backend (from the satellite) will be handled at a high level here.
- `schemas.py` any custom classes we write to help with the code
- `service.py` holds the functionality for the routes.

The other notable folder is the `frontend` folder. This holds anything to display the data to the end user. If you want to make/edit a graph, enter the graph folder.

If you want to test the app without the Zero connected, write a function in the `tests` folder to make sure it looks good.

### Running the app

In order to run the app, make sure you have the python `venv` (virtual environemnt) installed. 

To make a virtual environment folder called `venv` use the following command.
```
python -m venv venv
```
If you are on Linux (Im not sure for Mac), use:
```
source venv/bin/activate
```
To enter the virtual environment. Then use:
```
pip install -r requirements.txt
```
To install any requirements needed. Finally, to actually run the app, make sure you are in the base directory and run once:
```
set FLASK_ENV=development && set FLASK_APP=app.py
```
And then simply run:
```
python app.py
```
This should begin the app, and says what local URL it is running on. 