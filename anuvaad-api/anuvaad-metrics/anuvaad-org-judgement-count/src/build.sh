#!/bin/bash
commit_id=${BUILD_ID}-$(git rev-parse --short HEAD)
echo $commit_id> commit_id.txt
docker run \
    --rm \
    -e SONAR_HOST_URL="https://sonarqube.anuvaad.org" \
    -e SONAR_LOGIN=$sonar_key \
    -v "${PWD}:/usr/src" \
    sonarsource/sonar-scanner-cli \
    -Dsonar.projectKey=$image_name \
    -Dsonar.sonar.projectName="$image_name" \
    -Dsonar.sonar.projectVersion=1.0 \
    -Dsonar.sonar.sourceEncoding=UTF-8
docker build -t anuvaadio/$image_name:$commit_id .
docker login -u $dockerhub_user -p $dockerhub_pass
docker push anuvaadio/$image_name:$commit_id
