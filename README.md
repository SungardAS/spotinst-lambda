# spotinst-lambda

A [lambda-formation](https://github.com/SungardAS/lambda-formation) project that will Create, Update and Cancel [Spotinst](http://spotinst.com) resources for AWS Lambda and CloudFormation.


[![Build
Status](https://travis-ci.org/SungardAS/spotinst-lambda.svg?branch=master)](https://travis-ci.org/SungardAS/spotinst-lambda?branch=master)
[![Code
Climate](https://codeclimate.com/github/SungardAS/spotinst-lambda/badges/gpa.svg?branch=master)](https://codeclimate.com/github/SungardAS/spotinst-lambda?branch=master)
[![Coverage
Status](https://coveralls.io/repos/SungardAS/spotinst-lambda/badge.svg?branch=master)](https://coveralls.io/r/SungardAS/spotinst-lambda?branch=master)
[![Dependency
Status](https://david-dm.org/SungardAS/spotinst-lambda.svg?branch=master)](https://david-dm.org/SungardAS/spotinst-lambda?branch=master)

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

- resourceType *required* `string` - `elasticgroup` is the only valid
  option at this time

- requestType *required* `string` - create|update|delete

- group `object` - Spotinst group definition. Required for create|update, not used for delete

- groupId `string` - required for update|delete



## CloudFormation

ResourceType must be set to `elasticgroup`


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
      "groupId": ELASTICGROUP_ID
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

## Major Changes

### 0.1.0

First release

### 0.2.0

Project is now based on
[lambda-formation](https://github.com/SungardAS/lambda-formation).
Resources now live in `lib/resources/` instead of `lib/`.

New resources
should be created wtih the lambda-formation
[generator](https://github.com/SungardAS/generator-lambda-formation).

