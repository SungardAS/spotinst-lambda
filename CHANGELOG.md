# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.0] - 2016-04-12
### Added
- `subscription` resource - add, update and delete Spotinst Notification
  Subscriptions
- Error messages from Spotinst get passed to `Reason` and will show up
  in the CloudFormation output

### Changed
- `groupId` parameter deprecated.  An ID must be passed as `id` or
  `PhysicalResourceId`
- upgraded to lambda-formation 0.1.4

### Fixed
- elasticgroup resources now call the correct upstream lambda-formation
  handler
- The test suite was in a bad state. It has been updated for
  supscriptions, forcing the ID parameter and lambda-formation.

