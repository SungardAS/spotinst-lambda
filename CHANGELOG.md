# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.4.0] - 2016-10-11
### Added
- 'elastigroup' update - now support updatePolicy to perform group roll.

### Changed
- 'elastigroup' delete - if the group doesn't exist, mark the delete as
   successful

## [0.3.2] - 2016-09-25
### Added
- Ability to use `elastigroup` resource. This is will eventually
  replace `elasticgroup` which was a misspelling in the original version.

## [0.3.1] - 2016-08-06
### Changed
- For any `UPDATE` action initiated by CloudFormation the old config
  will be compared with the new config.  If keys have been removed they
  will be set as `null` to Spotinst. This ensures the CF and Spotinst
  declarations are exactly the same.
=======
>>>>>>> 172eb0a1d6a7cd18f7d9851c4ddd89ece6ef6c26

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

