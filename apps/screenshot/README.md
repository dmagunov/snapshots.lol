### Running local Docker container

1. `docker build -t <image-name> .`
2. `docker run -p 9000:8080 --add-host=<thenftsnapshot>:<192.168.1.10> <image-name>`,

   - `thenftsnpashot` is the hostname of the locally running apps/app, can be added to the hosts file `/etc/hosts`:

   ```
    127.0.0.1       localhost thenftsnapshot
   ```

   - `192.168.1.10` - your local ip addr, can be found by running `ipconfig getifaddr en0`, where `en0` is default network interface (on Mac)

3. in other Terminal window `curl -X POST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"url":"https://thenftsnapshot:3000/how"}' -H "Content-Type: application/json" -v > /dev/null`

To remove a Docker image: `docker image rm <image-name> -f`

### Manually pushing Docker Image to AWS Elastic Container Repository (ECR)

1. `docker build -t <image-name> .`
2. `aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com`

3. `aws ecr create-repository --repository-name <image-name> --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true`

4. `docker tag <image-name> <account-id>.dkr.ecr.<region>.amazonaws.com/<image-name>`

5. `docker push <account-id>.dkr.ecr.<region>.amazonaws.com/<image-name>`

### TODO

Automatically deploy to AWS Lambda / ECR, using Github Actions

https://medium.com/platform-engineer/automating-lambda-container-image-deployments-with-aws-sam-cli-71afbf09e172

https://aws.amazon.com/blogs/architecture/field-notes-scaling-browser-automation-with-puppeteer-on-aws-lambda-with-container-image-support/
