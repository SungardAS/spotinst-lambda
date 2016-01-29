# spotinst-lambda

AWS Lambda functions to Create, Update and Cancel [Spotinst](http://spotinst.com) resources


[![Build
Status](https://travis-ci.org/SungardAS/spotinst-lambda.svg?branch=master)](https://travis-ci.org/SungardAS/spotinst-lambda?branch=master)
[![Code
Climate](https://codeclimate.com/github/SungardAS/spotinst-lambda/badges/gpa.svg?branch=master)](https://codeclimate.com/github/SungardAS/spotinst-lambda?branch=master)
[![Coverage
Status](https://coveralls.io/repos/SungardAS/spotinst-lambda/badge.svg?branch=master)](https://coveralls.io/r/SungardAS/spotinst-lambda?branch=master)
[![Dependency
Status](https://david-dm.org/SungardAS/spotinst-lambda.svg?branch=master)](https://david-dm.org/SungardAS/spotinst-lambda?branch=master)

## AWS Lambda

### parameters

#### Long Term Credentials

`username` - Spotinst Username

`password` - Spotinst Password

`clientId` - Client ID for Spotinst Account

`clientSecret` - Client Secret for Spotinst Account

#### Temp Credentials

`accessCode` - Short term access code retrieved using Spotinst token
service


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

When called by CloudFormation [cfn-response](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-cfnresponsemodule)
will be used to return the correct physicalResourceId to the stack.

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
