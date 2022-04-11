from flask import Blueprint
from flask_restful import Api
from resources import CreateOrganization,SearchOrganization

ORGANIZATION_BLUEPRINT = Blueprint("organization", __name__)

Api(ORGANIZATION_BLUEPRINT).add_resource(
    CreateOrganization, "/v1/org/upsert"
)

Api(ORGANIZATION_BLUEPRINT).add_resource(
    SearchOrganization, "/v1/org/search"
)

