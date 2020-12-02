#!/bin/python
from flask import request
from service.teservice import TEService
from .translatorcontroller import translatorapp
from configs.translatorconfig import context_path


@translatorapp.route(context_path + '/v1/tmx/create', methods=["POST"])
def tmx_create():
    service = TEService()
    return service.push_to_tmx_store(request.get_json())


@translatorapp.route(context_path + '/v1/tmx/bulk/create/xls-upload', methods=["POST"])
def tmx_create_bulk():
    service = TEService()
    return service.push_csv_to_tmx_store(request.get_json())
