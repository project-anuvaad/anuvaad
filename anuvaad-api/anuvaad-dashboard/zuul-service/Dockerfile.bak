FROM egovio/apline-jre:8u121

MAINTAINER Venki<venki@egovernments.org>

EXPOSE 8080

COPY /target/zuul-0.0.1-SNAPSHOT.jar /opt/egov/zuul.jar

COPY start.sh /usr/bin/start.sh

RUN chmod +x /usr/bin/start.sh

CMD ["/usr/bin/start.sh"]
