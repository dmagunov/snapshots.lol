FROM public.ecr.aws/lambda/nodejs:16

# Copy function code
COPY index.js package.json ${LAMBDA_TASK_ROOT}
WORKDIR ${LAMBDA_TASK_ROOT}
RUN npm install

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]