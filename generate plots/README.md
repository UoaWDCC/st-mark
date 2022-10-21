# Generating plots in mongoDB

## Purpose

Generate all plots on the graveyard map. Includes helper functions that can be used to modify the graves.

## Getting Started

To get a local copy up and running follow steps below.

### Requirements

- Python >= `3.7`
- Packages included in `requirements.txt` file

### Install dependencies

Create and activate virtual environment:

```sh
python -m virtualenv .
./Scripts/activate
```

Install packages:

```sh
python -m pip install -r requirements.txt
```

### Create .env file

Create a .env file in current directory with the following content:

```sh
MONGO_URI=mongodbtestaddresshere
```