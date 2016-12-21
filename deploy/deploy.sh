#!/usr/bin/env bash
set -e

release_timestamp=$(date +%Y%m%d%H%M%S)

if ! [ "${TRAVIS_TAG}" = "false"  ]; then
    package_name=Service.Content."$TRAVIS_TAG"
else
    exit
fi

mkdir -p ~/package/

cp -r src ~/release/
cp -r node_modules ~/release/
cp index.js ~/release/

cd ~/release/; zip -r ~/package/"$package_name".zip *;

cd $TRAVIS_BUILD_DIR
git remote set-branches --add origin master
git fetch
[ ! -z $(git diff --name-only origin/master src/ index.js ) ] && LAMBDA_CHANGED=true || LAMBDA_CHANGED=false
[ ! -z $(git diff --name-only origin/master api-docs/) ] && API_CHANGED=true || API_CHANGED=false

if $LAMBDA_CHANGED
  then
    if [ $TRAVIS_BRANCH == "master" ]
      then
        aws s3 cp ~/package/"$package_name".zip s3://carmudi-deploy-ap/PACKAGES/Service.Content/ --region=ap-southeast-1
        version=$(aws lambda update-function-code --function-name getPost --s3-bucket carmudi-deploy-ap --s3-key PACKAGES/Service.Content/"$package_name".zip --publish --region ap-southeast-1|jq .Version)
        aws lambda update-alias --function-name getOnePost --name prod --function-version $version --region ap-southeast-1
    elif [ $TRAVIS_BRANCH == "develop" ]
      then
        aws s3 cp ~/package/"$package_name".zip s3://carmudi-deploy-eu-central/PACKAGES/Service.Content/ --region=eu-central-1
        version=$(aws lambda update-function-code --function-name getPost --s3-bucket carmudi-deploy-eu-central --s3-key PACKAGES/Service.Content/"$package_name".zip --publish --region eu-central-1|jq .Version)
        aws lambda update-alias --function-name getOnePost --name dev --function-version $version --region eu-central-1
    fi
fi

if $API_CHANGED
  then
    if [ $TRAVIS_BRANCH == "master" ]
      then
        cd $TRAVIS_BUILD_DIR
        api_id=$(aws apigateway import-rest-api --body 'file:///api-docs/post.yml' --region ap-southeast-1 | jq -r .id)
        aws apigateway create-deployment --rest-api-id "$api_id" --stage-name production --stage-description production --description ContentAPI --region=ap-southeast-1
    elif [ $TRAVIS_BRANCH == "develop" ]
      then
        cd $TRAVIS_BUILD_DIR
        api_id=$(aws apigateway import-rest-api --body 'file:///api-docs/post.yml' --region eu-west-1 | jq -r .id)
        aws apigateway create-deployment --rest-api-id "$api_id" --stage-name staging --stage-description staging --description ContentAPI --region=eu-central-1
fi
