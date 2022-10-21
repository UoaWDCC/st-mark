# taken from https://www.mongodb.com/languages/python

def get_database():
    import os
    from dotenv import load_dotenv
    from pymongo import MongoClient
    load_dotenv()

    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    # CONNECTION_STRING = "mongodb://localhost:27017/"
    # CONNECTION_STRING = "mongodb+srv://team2022:team2022@cluster0.mww71.mongodb.net/stmarksgraveyard?retryWrites=true&w=majority"

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(os.getenv('MONGO_URI'))

    # Create the database for our example (we will use the same database throughout the tutorial
    return client['st-marks-graveyard']


# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":

    # Get the database
    dbname = get_database()
