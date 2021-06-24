from flask_restful import Resource
from flask import request
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import os
import subprocess

class HealthResource(Resource):
    def get(self):
        log_info("NMT Health api called",MODULE_CONTEXT)
        pipe = subprocess.Popen(["gpustat", "--json"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        res = pipe.stdout.read().decode('utf-8')
        # pipe = os.system('gpustat --json')
        out = CustomResponse(Status.SUCCESS.value,res)
        return out.getres() 
        