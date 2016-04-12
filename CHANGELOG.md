# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- `subscription` resource

### Changed
- `groupId` parameter deprecated.  An ID must be passed as `id` or
  `PhysicalResourceId`

### Fixed
- elasticgroup resources now call the correct upstream lambda-formation
  handler
- The test suite was in a bad state. It has been updated for
  supscriptions, forcing the ID parameter and lambda-formation.

