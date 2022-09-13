from config import REDIS_SERVER_HOST,REDIS_SERVER_PORT,REDIS_OCRGV_DB
from anuvaad_auditor.loghandler import log_info, log_exception
import redis
from flask import g
import src.utilities.app_context as app_context

def get_redis():

    rdb = redis.StrictRedis(host=REDIS_SERVER_HOST, port=REDIS_SERVER_PORT, db=REDIS_OCRGV_DB, decode_responses=True,encoding="utf-8")
    log_info("Establishing connection with redis store", app_context.app_context)

    # if 'redisdb' not in g:
    #     log_info("Establishing connection with redis store", getContext())
    #     g.redisdb = redis.Redis(host=REDIS_SERVER_HOST, port=REDIS_SERVER_PORT, db=0)
    return rdb