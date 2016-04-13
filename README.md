# spotinst-lambda

A [lambda-formation](https://github.com/SungardAS/lambda-formation) project that will Create, Update and Cancel [Spotinst](http://spotinst.com) resources for AWS Lambda and CloudFormation.


[![Build Status][travis-ci-image]][travis-ci-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][david-dm-image]][david-dm-url]

## Quick Start

    $ # Install only dependencies (no devDependencies)
    $ npm --production install
    $
    $ # create the distribution
    $ npm run dist
    $
    $ # Now upload dist/spotinst-lambda.zip to AWS Lambda, S3 or include in CloudFormation

## AWS Lambda

### parameters

#### Credentials

Use either `User Credentials` parameters or `accessCode`.  If both are provided
then `User Credentials` take precedence.

While multiple forms of credentials are supported it is highly recommended
to use a [Personal Access
Token](https://spotinst.atlassian.net/wiki/display/API/Get+API+Personal+Access+Token)

##### User Credentials

`username` - Spotinst Username

`password` - Spotinst Password

`clientId` - Client ID for Spotinst Account

`clientSecret` - Client Secret for Spotinst Account

##### Temp Credentials / Personal Access Token

`accessCode` - Short term access code retrieved using Spotinst token
service or [Personal Access
Token](https://spotinst.atlassian.net/wiki/display/API/Get+API+Personal+Access+Token)


#### handler
index/handler

**Params**

In addition to one of the credential parameter groups:

- resourceType *required* `string` - elasticgroup|subscription

- requestType *required* `string` - create|update|delete

- group `object` - Spotinst group definition. Required for `elasticgroup` create|update, not used for delete

- subscription `object` - Spotinst group definition. Required for `subscription` create|update, not used for delete

- id `string` - required for update|delete

## CloudFormation

Set the resource `Type` to  `Custom::elasticgroup` or `Custom::subscription`


## Examples

### Lambda - create elasticgroup

    {
      "accessToken": TOKEN
      "requestType": "create",
      "resourceType": "elasticgroup",
      "group": {
        "name": "test",
        "strategy": {
          "risk": 100,
          "onDemandCount": null,
          "availabilityVsCost": "balanced"
        },
        "capacity": {
          "target": 1,
          "minimum": 1,
          "maximum": 1
        },
        "scaling": {},
        "compute": {
          "instanceTypes": {
            "ondemand": "m3.medium",
            "spot": [
              "m3.medium"
            ]
          },
          "availabilityZones": [
            {
              "name": "us-east-1a",
              "subnetId": SUBNET_ID
            }
          ],
          "launchSpecification": {
            "monitoring": false,
            "imageId": "ami-60b6c60a",
            "keyPair": "kevinkey",
            "securityGroupIds": [
              SECURITY_GROUP_ID
            ]
          },
          "product": "Linux/UNIX"
        },
        "scheduling": {},
        "thirdPartiesIntegration": {}
      }
    }

### Lambda - delete elasticgroup

    {
      "accessToken": TOKEN
      "requestType": "delete",
      "resourceType": "elasticgroup",
      "id": ELASTICGROUP_ID
    }


### CloudFormation

    {
      "AWSTemplateFormatVersion": "2010-09-09",
      "Resources": {
        "CFCR195GN": {
          "Type": "Custom::elasticgroup",
          "Properties": {
            "ServiceToken": SERVICE_TOKEN,
            "accessToken": TOKEN,
            "group": {
              "name": "test",
              "strategy": {
                "risk": 100,
                "availabilityVsCost": "balanced"
              },
              "capacity": {
                "target": 1,
                "minimum": 1,
                "maximum": 1
              },
              "scaling": {},
              "compute": {
                "instanceTypes": {
                  "ondemand": "m3.medium",
                  "spot": [
                    "m3.medium"
                    ]
                },
                "availabilityZones": [
                  {
                    "name": "us-east-1a",
                    "subnetId": SUBNET_ID
                  }
                ],
                "launchSpecification": {
                  "monitoring": false,
                  "imageId": "ami-60b6c60a",
                  "keyPair": "testkey",
                  "securityGroupIds": [
                    SECURITY_GROUP_ID
                    ]
                },
                "product": "Linux/UNIX"
              },
              "scheduling": {},
              "thirdPartiesIntegration": {}
            }
          }
        }
      }
    }


[code-climate-image]: https://codeclimate.com/github/SungardAS/spotinst-lambda/badges/gpa.svg?branch=master
[code-climate-url]: https://codeclimate.com/github/SungardAS/spotinst-lambda?branch=master
[travis-ci-image]: https://travis-ci.org/SungardAS/spotinst-lambda.svg?branch=master
[travis-ci-url]: https://travis-ci.org/SungardAS/spotinst-lambda?branch=master
[coveralls-image]: https://coveralls.io/repos/SungardAS/spotinst-lambda/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/SungardAS/spotinst-lambda?branch=master
[david-dm-image]: https://david-dm.org/SungardAS/spotinst-lambda.svg?branch=master
[david-dm-url]: https://david-dm.org/SungardAS/spotinst-lambda?branch=master
