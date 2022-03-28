#!/bin/sh

if [[ -z "${JAVA_OPTS}" ]];then
    export JAVA_OPTS="-Xmx128m -Xms128m"
fi

java ${JAVA_OPTS} -jar /opt/egov/zuul.jar
