#!/bin/bash

# Define root directory
root_dir="$(cd "$(dirname "$0")" && pwd)"
echo "Root directory: $root_dir"

deploy_lambda_function() {
  functionDir=$1
  dist_dir="$root_dir/lambda/dist/$functionDir"
  source_dir="$root_dir/src/handlers/$functionDir"

  echo "🚀 Deploying Lambda function: $functionDir"
  echo "📂 Source directory: $source_dir"
  echo "📦 Distribution directory: $dist_dir"

  if [ ! -d "$source_dir" ]; then
    echo "❌ ERROR: Source directory does not exist: $source_dir"
    exit 1
  fi

  # Remove old dist directory
  if [ -d "$dist_dir" ]; then
    echo "🗑️ Removing old dist directory: $dist_dir"
    rm -rf "$dist_dir"
  fi
  mkdir -p "$dist_dir"

  cd "$source_dir" || exit
  echo "📂 Entering directory: $source_dir"

  if [ -e "index.mjs" ]; then
    echo "✅ Found index.mjs in $source_dir"

    # Install dependencies if package.json exists
    if [ -e "package.json" ]; then
      echo "📦 Installing dependencies..."
      npm install --omit=dev
    fi

    zipFile="$dist_dir/$functionDir.zip"

    # Ensure node_modules exists
    if [ ! -d "node_modules" ]; then
      echo "❌ ERROR: node_modules directory missing! Run 'npm install' first."
      exit 1
    fi

    # Zip function with node_modules
    echo "📦 Creating ZIP package: $zipFile"
    zip -q -r9 "$zipFile" ./*

    # Check if ZIP was created
    if [ -e "$zipFile" ]; then
      echo "✅ Lambda function $functionDir packaged successfully."
    else
      echo "❌ ERROR: Failed to create ZIP file: $zipFile"
      exit 1
    fi

    # Deploy to AWS Lambda
    echo "🚀 Deploying $functionDir to AWS Lambda..."
    deploy_output=$(aws lambda update-function-code \
      --function-name "$functionDir" \
      --zip-file "fileb://$zipFile" \
      --region eu-west-1 \
      --profile mfa-session 2>&1)

    if [[ $? -eq 0 ]]; then
      echo "✅ Successfully deployed $functionDir to AWS Lambda."
    else
      echo "❌ ERROR: Failed to deploy $functionDir to AWS Lambda."
      echo "$deploy_output"
      exit 1
    fi

  fi

  cd "$root_dir" || exit
}

# Deploy specific functions
deploy_lambda_function generateCompletion
deploy_lambda_function generatePhrases
deploy_lambda_function contentGenerator
deploy_lambda_function generateRoleplay

echo "✅ Deployment completed."
