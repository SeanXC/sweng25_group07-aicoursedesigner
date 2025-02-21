#!/bin/sh

# Define root directory
root_dir="$PWD"

deploy_lambda_function() {
  functionDir=$1
  dist_dir="$root_dir/lambda/dist/$functionDir"
  source_dir="$root_dir/src/handlers/$functionDir"

  # Remove old zip files
  if [ -e "$dist_dir" ]; then
    rm -rf "$dist_dir"
  fi
  mkdir -p "$dist_dir"

  # Loop through function directories
  for filename in "$source_dir"/*; do
    [ -e "$filename" ] || continue
    cd "$filename" || exit
    if [ -e "index.mjs" ]; then
      # Install dependencies if package.json exists
      if [ -e "package.json" ]; then
        npm install --omit=dev
      fi

      currentDirName=${PWD##*/}
      zip -q -r9 "$dist_dir"/"$currentDirName".zip ./*
      echo "Lambda function $currentDirName packaged."

      # Deploy to AWS Lambda
      aws lambda update-function-code --function-name "$currentDirName" --zip-file "fileb://$dist_dir/$currentDirName.zip" --region eu-west-1
      
      # Clean up node_modules to avoid extra size
      if [ -e "package.json" ]; then
        rm -rf node_modules
      fi
    fi
  done
}

# Deploy all functions
deploy_lambda_function generateCompletion
deploy_lambda_function generatePhrases
deploy_lambda_function contentGenerator

echo "Deployment completed."
