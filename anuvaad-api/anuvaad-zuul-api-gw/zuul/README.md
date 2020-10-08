# Zuul Service
### API Gateway
API Gateway provides a unified interface for a set of microservices so that clients do not need to know about all the details of microservices internals.

Digit uses Zuul as an edge service that proxies requests to multiple back-end services. It provides a unified “front door” to our ecosystem.
This allows any browser, mobile app or other user interface to consume underlying services.

### DB UML Diagram

- NA

### Service Dependencies
- egov-accesscontrol
- egov-user

### Swagger API Contract

- NA
## Service Details
**DIGIT** uses **Netflix ZUUL** as API Gateway.

**Functionality**
- Provides easier API interface to clients
- Can be used to prevent exposing the internal micro-services structure to outside world.
- Allows to refactor microservices without forcing the clients to refactor consuming logic
- Can centralize cross-cutting concerns like security, monitoring, rate limiting etc

**ZUUL Components**

Zuul has mainly four types of filters that enable us to intercept the traffic in different timeline of the request processing for any particular transaction.
We can add any number of filters for a particular url pattern.

- pre filters – are invoked before the request is routed.
- post filters – are invoked after the request has been routed.
- route filters – are used to route the request.
- error filters – are invoked when an error occurs while handling the request.

**Features**
- Microservice authentication and security
- Authorization
- API Routing
- Open APIs using Whitelisting
- RBAC filter
- Logout filter for finance module
- Property module tax calculation filter for firecess
- Request enrichment filter:
- Addition of co-relation id
- Addition of authenticated user’s userinfo to requestInfo.
- Error filter:
    - Error response formatting
- Validation Filter to check if a tenant of a particular module is enabled or not.
- Multitenancy Validation Filter. Take the tenant id from Req body or Query Param and validate against additional tenant role or primary tenant role.
- Devops efficiency: API Response time logging and Send notification if it is taking more time.

**Routing Property**

For each service, below mentioned property has to be add in **`routes.properties`**
```ini
-zuul.routes.{serviceName}.path = /{context path of service}/**
-zuul.routes.{serviceName}.stripPrefix = {true/false}
-zuul.routes.{serviceName}.url = {service host name}
```
### Kafka Consumers

- NA

### Kafka Producers

- NA