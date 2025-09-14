# S3 Setup Commands for React SPA

## Option 1: Fix Current Bucket Configuration (COMPLETED)
```bash
# Configure existing bucket for React SPA
/Users/kris/anaconda3/condabin/conda run -n aws aws s3api put-bucket-website --bucket skrinak.com --website-configuration '{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "Documents/AAI/pitch/index.html"
    }
}' --profile ksk
```

## Option 2: Create Dedicated Bucket (If Option 1 doesn't work)

### Step 1: Create New Bucket
```bash
/Users/kris/anaconda3/condabin/conda run -n aws aws s3 mb s3://aai-pitch --profile ksk
```

### Step 2: Configure Bucket for Static Website Hosting
```bash
/Users/kris/anaconda3/condabin/conda run -n aws aws s3api put-bucket-website --bucket aai-pitch --website-configuration '{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "index.html"
    }
}' --profile ksk
```

### Step 3: Set Bucket Policy for Public Access
```bash
/Users/kris/anaconda3/condabin/conda run -n aws aws s3api put-bucket-policy --bucket aai-pitch --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::aai-pitch/*"
        }
    ]
}' --profile ksk
```

### Step 4: Upload Files to New Bucket
```bash
/Users/kris/anaconda3/condabin/conda run -n aws aws s3 sync build/ s3://aai-pitch/ --profile ksk
```

### Step 5: Get Website URL
```bash
echo "Website URL: http://aai-pitch.s3-website-us-west-2.amazonaws.com"
# Confirmed region: us-west-2
/Users/kris/anaconda3/condabin/conda run -n aws aws s3api get-bucket-location --bucket aai-pitch --profile ksk
```

## Troubleshooting Commands

### Check Bucket Website Configuration
```bash
/Users/kris/anaconda3/condabin/conda run -n aws aws s3api get-bucket-website --bucket skrinak.com --profile ksk
```

### List Files in S3
```bash
/Users/kris/anaconda3/condabin/conda run -n aws aws s3 ls s3://skrinak.com/Documents/AAI/pitch/ --profile ksk
```

### Check Bucket Policy
```bash
/Users/kris/anaconda3/condabin/conda run -n aws aws s3api get-bucket-policy --bucket skrinak.com --profile ksk
```

### Test URL Access
```bash
curl -I https://skrinak.com/Documents/AAI/pitch/
curl -I https://skrinak.com/Documents/AAI/pitch/index.html
```