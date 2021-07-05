import json

import redis
from anuvaad_auditor import log_exception

from config import redis_server_host, redis_server_port, redis_db

redis_client = None


class JobRepository:

    def __init__(self):
        pass

    # Initialises and fetches redis client
    def redis_instantiate(self):
        redis_client = redis.Redis(host=redis_server_host, port=redis_server_port, db=redis_db)
        return redis_client


    def get_redis_instance(self):
        if not redis_client:
            return self.redis_instantiate()
        else:
            return redis_client

    def upsert(self, key, value):
        try:
            client = self.get_redis_instance()
            client.set(key, json.dumps(value), ex=86400)
            return 1
        except Exception as e:
            log_exception("Exception in FT REPO: upsert | Cause: " + str(e), None, e)
            return None

    def delete(self, key):
        try:
            client = self.get_redis_instance()
            client.delete(key)
            return 1
        except Exception as e:
            log_exception("Exception in FT REPO: delete | Cause: " + str(e), None, e)
            return None

    def search(self, key_list):
        try:
            client = self.get_redis_instance()
            result = []
            for key in key_list:
                val = client.get(key)
                if val:
                    result.append(json.loads(val))
            return result
        except Exception as e:
            log_exception("Exception in FT REPO: search | Cause: " + str(e), None, e)
            return None






