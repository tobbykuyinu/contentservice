#!/usr/bin/env bash
set -e

release_timestamp=$(date +%Y%m%d%H%M%S)

if ! [ "${TRAVIS_TAG}" = "false"  ]; then
    package_name=Service.Content."$TRAVIS_TAG"
else
    exit
fi

mkdir -p ~/package/

mkdir -p ~/release/
mkdir -p ~/release/src
cp -r src/* ~/release/src/
cp -r node_modules ~/release/
cp index.js ~/release/

cd ~/release/; zip -r ~/package/"$package_name".zip *;

aws lambda update-function-code --function-name getOnePost --zip-file fileb://~/package/"$package_name".zip --publish --region "$AWS_REGION"
#aws lambda create-alias --function-name getOnePost --function-version "\$LATEST" --name "${TRAVIS_TAG//./_}" --region ap-southeast-1

aws s3 cp ~/package/"$package_name".zip s3://carmudi-deploy-ap/PACKAGES/Service.Content/ --region=ap-southeast-1
aws s3 cp ~/package/"$package_name".zip s3://carmudi-deploy-eu-central/PACKAGES/Service.Content/ --region=eu-central-1

