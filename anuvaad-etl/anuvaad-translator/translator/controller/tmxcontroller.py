#!/bin/python
from flask import request
from service.teservice import TEService
from .translatorcontroller import translatorapp
from configs.translatorconfig import context_path


@translatorapp.route(context_path + '/v1/tmx/create', methods=["POST"])
def tmx_create():
    service = TEService()
    data = request.get_json()
    data["userID"] = request.headers["x-user-id"]
    return service.push_to_tmx_store(data)


@translatorapp.route(context_path + '/v1/tmx/bulk/create/xls-upload', methods=["POST"])
def tmx_create_bulk():
    service = TEService()
    data = request.get_json()
    data["userID"] = request.headers["x-user-id"]
    return service.push_csv_to_tmx_store(data)
