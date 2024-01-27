## Log in and use AWS CLI with SSO

```shell
$ aws sso login --profile xxx
```

## Create a bucket in S3

```shell:powershell
$ aws s3api create-bucket --bucket xxx --create-bucket-configuration LocationConstraint=ap-northeast-1

{
    "Location": "http://xxx.s3.amazonaws.com/"
}
```

## Package the template file

```shell:powershell
$ aws cloudformation package `
    --template-file template.yaml `
    --s3-bucket xxx `
    --output-template-file packaged-template.yaml

Successfully packaged artifacts and wrote output template to file packaged-template.yaml.
Execute the following command to deploy the packaged template
aws cloudformation deploy --template-file xxx --stack-name <YOUR STACK NAME>
```

```
.\AWS-SAM-Practice\
│  + packaged-template.yaml
│  README.md
│  template.yaml
│
└─translate-function
        index.mjs
```

## Deploy the packaged template

```shell:powershell
$ aws cloudformation deploy `
    --region ap-northeast-1 `
    --template-file ./packaged-template.yaml `
    --stack-name xxx `
    --capabilities CAPABILITY_IAM

Waiting for changeset to be created..
Waiting for stack create/update to complete
Successfully created/updated stack - xxx
```

## Send a request to the deployed API

```shell
# Access
https://xxx.ap-northeast-1.amazonaws.com/dev/translate?input_text=チュートリアル完了

# Response
Tutorial completed
```
