# Screenshot capture app

Capture a screenshot of a given NFT Snapshot.

### Usage with AWS Lambda and AWS Elastic Container Repository (ECR)

1. `docker build -t <image-name> .`
2. `aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com`
3. `aws ecr create-repository --repository-name <image-name> --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true`
4. `docker tag <image-name> <account-id>.dkr.ecr.<region>.amazonaws.com/<image-name>`
5. `docker push <account-id>.dkr.ecr.<region>.amazonaws.com/<image-name>`

Replace `<image_name>` with the name of the image you want to use, for example `screenshot-capture`, `<region>` with the your AWS region, `<account-id>` with your AWS account ID.

6. Create a function in AWS Lambda with the following configuration:
   - Image: `<account-id>.dkr.ecr.<region>.amazonaws.com/<image-name>:<image-tag>`
   - Memory: `512 MB` or more
   - Timeout: `1 min`
