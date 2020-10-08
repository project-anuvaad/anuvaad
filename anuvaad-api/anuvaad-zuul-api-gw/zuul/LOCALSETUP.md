# Local Setup

To setup the Zuul service in your local system, clone the [Core Service repository](https://github.com/egovernments/core-services).

## Dependencies

### Infra Dependency

- [ ] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [ ] Kafka
  - [ ] Consumer
  - [ ] Producer

## Running Locally

To run the Zuul services in your local system, you need to port forward below services

```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-accesscontrol) 8087:8080
kubectl port-forward -n egov $(kgpt egov-user) 8088:8080
``` 

Update below listed properties in **`application.properties`** before running the project:

```ini
egov.auth-service-host = http://127.0.0.1:8088
egov.authorize.access.control.host = http://127.0.0.1:8087
#  If you are using a local file prefix it with file:///PATH TO FILE/FILENAME
zuul.routes.filepath = {path of file which contain the routing information of each modules} 
```
