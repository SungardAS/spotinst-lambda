# spotinst-lambda

AWS Lambda functions to Create, Update and Cancel [Spotinst](http://spotinst.com) resources


[![NPM](https://nodei.co/npm/spotinst-lambda.png)](https://nodei.co/npm/spotinst-lambda/)

[![Build
Status](https://travis-ci.org/SungardAS/spotinst-lambda.svg?branch=master)](https://travis-ci.org/SungardAS/spotinst-lambda?branch=master)
[![Code
Climate](https://codeclimate.com/github/SungardAS/spotinst-lambda/badges/gpa.svg?branch=master)](https://codeclimate.com/github/SungardAS/spotinst-lambda?branch=master)
[![Coverage
Status](https://coveralls.io/repos/SungardAS/spotinst-lambda/badge.svg?branch=master)](https://coveralls.io/r/SungardAS/spotinst-lambda?branch=master)
[![Dependency
Status](https://david-dm.org/SungardAS/spotinst-lambda.svg?branch=master)](https://david-dm.org/SungardAS/spotinst-lambda?branch=master)

## Compatible with CloudFormation

When called by CloudFormation [cfn-response](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-cfnresponsemodule)
will be used to return the correct status and PhysicalId will be returned to the stack.
