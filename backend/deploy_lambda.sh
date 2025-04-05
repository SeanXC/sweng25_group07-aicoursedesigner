#!/bin/bash

set -e

zip_dir="backend/build_zips"
region="${AWS_DEFAULT_REGION:-eu-west-1}"

# get latest ARN
layer_arn=$(aws lambda list-layer-versions \
  --layer-name common-dependencies \
  --region "$region" \
  --query 'LayerVersions[0].LayerVersionArn' \
  --output text)

echo "🚀 Deploying Lambda functions from $zip_dir"
echo "📦 Using Layer: $layer_arn"

for zip_file in "$zip_dir"/*.zip; do
  function_name=$(basename "$zip_file" .zip)
  echo "🔄 Updating Lambda function: $function_name"

  aws lambda update-function-code \
    --function-name "$function_name" \
    --zip-file "fileb://$zip_file" \
    --region "$region"

  aws lambda update-function-configuration \
    --function-name "$function_name" \
    --layers "$layer_arn" \
    --region "$region"

  echo "✅ Updated $function_name"
done

echo "🎉 All Lambda functions deployed successfully!"
