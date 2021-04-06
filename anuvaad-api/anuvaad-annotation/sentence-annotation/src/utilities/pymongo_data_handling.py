import json 
import datetime
import bson.objectid

def custom_data_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    elif isinstance(x, bson.objectid.ObjectId):
        return str(x)
    else:
        raise TypeError(x)

def normalize_bson_to_json(data):
    return json.loads(json.dumps(data, default=custom_data_handler))