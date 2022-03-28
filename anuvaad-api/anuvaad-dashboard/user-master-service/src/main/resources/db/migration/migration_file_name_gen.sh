#!/bin/sh


echo "Please enter your script file name : "
read given_name
file_name=$given_name

current_time=$(date "+%Y%m%d%H%M%S")

echo "Current Time : $current_time"

new_fileName="V""$current_time"__"$file_name"

echo "New FileName: " "$new_fileName"

mv $file_name $new_fileName

echo "$new_fileName created under ${PWD}, copy this file to add your migrations folder"


