#!/bin/bash

set -e

zip_dir="backend/build_zips"
region="${AWS_DEFAULT_REGION:-eu-west-1}"
functions=("generateChat" "generateCompletion" "generatePhrases" "userInfo")

echo "🚀 Deploying selected Lambda functions from $zip_dir"

for fn in "${functions[@]}"; do
  zip_file="$zip_dir/${fn}.zip"
  if [ -f "$zip_file" ]; then
    echo "🔄 Updating Lambda function: $fn"
    aws lambda update-function-code \
      --function-name "$fn" \
      --zip-file "fileb://$zip_file" \
      --region "$region"
    echo "✅ Updated $fn"
  else
    echo "⚠️  Zip not found for $fn, skipping..."
  fi
done

echo "🎉 Selected Lambda functions deployed successfully!"
