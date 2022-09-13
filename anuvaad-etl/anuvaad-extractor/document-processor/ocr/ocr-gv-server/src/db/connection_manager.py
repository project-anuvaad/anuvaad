from config import REDIS_SERVER_HOST,REDIS_SERVER_PORT
from anuvaad_auditor.loghandler import log_info, log_exception
import redis
from flask import g
from src.utilities.app_context import getContext

def get_redis():

    rdb = redis.StrictRedis(host="localhost", port=6379, db=0, decode_responses=True,encoding="utf-8")
    log_info("Establishing connection with redis store", getContext())

    # if 'redisdb' not in g:
    #     log_info("Establishing connection with redis store", getContext())
    #     g.redisdb = redis.Redis(host=REDIS_SERVER_HOST, port=REDIS_SERVER_PORT, db=0)
    return rdb