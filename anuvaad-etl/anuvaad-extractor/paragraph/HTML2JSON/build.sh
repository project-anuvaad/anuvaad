#!/bin/bash
commit_id=$(git rev-parse --short HEAD)
echo $commit_id> commit_id.txt
docker build --build-arg D_F=$DEBUG_FLUSH -t anuvaadio/$image_name:$commit_id .
docker login -u $dockerhub_user -p $dockerhub_pass
docker push anuvaadio/$image_name:$commit_id