# Bugfix Requirements Document

## Introduction

Property listings are incorrectly displaying "DRAFT" status badges when they should show as published properties. This affects the public display of property status in the admin interface, where properties that have a status of "PUBLISHED" in the database are being shown with green "DRAFT" badges instead of the correct status. This creates confusion for administrators who cannot easily distinguish between actual draft properties and published ones.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a property has status "PUBLISHED" in the database THEN the admin interface displays a green badge with "DRAFT" text
1.2 WHEN viewing the properties list in the admin panel THEN all properties show "DRAFT" status regardless of their actual database status
1.3 WHEN the property status field contains "PUBLISHED" THEN the status badge incorrectly renders as "DRAFT"

### Expected Behavior (Correct)

2.1 WHEN a property has status "PUBLISHED" in the database THEN the admin interface SHALL display a green badge with "PUBLISHED" text
2.2 WHEN viewing the properties list in the admin panel THEN each property SHALL show its actual database status in the badge
2.3 WHEN the property status field contains "PUBLISHED" THEN the status badge SHALL render as "PUBLISHED"

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a property has status "DRAFT" in the database THEN the system SHALL CONTINUE TO display a badge with "DRAFT" text
3.2 WHEN a property has status "UNPUBLISHED" in the database THEN the system SHALL CONTINUE TO display the appropriate status badge
3.3 WHEN properties are filtered by status in the admin interface THEN the filtering logic SHALL CONTINUE TO work correctly
3.4 WHEN the public API fetches properties THEN it SHALL CONTINUE TO only return properties with status "PUBLISHED"