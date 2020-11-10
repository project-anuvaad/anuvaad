#!/bin/python
import json
import os
import redis

from configs.translatorconfig import redis_host


class TMXRepository:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self):
        redis_client = redis.Redis(redis_host)
        return redis_client

    # Inserts the records into tmx.
    def upsert(self, input_dict):
        client = self.instantiate()
        for key in input_dict.keys():
            client.hmset(key, input_dict[key])

    # Searches from the tmx redis store.
    def search(self, key_list):
        client = self.instantiate()
        result = []
        for key in key_list:
            record = json.loads(client.hgetall(key)[b'info'].decode('utf-8').replace("'", '"'))
            result.append(record)
        return result

