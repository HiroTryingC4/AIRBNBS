# Property Draft Status Fix Bugfix Design

## Overview

The bug manifests in the admin properties page where all properties display "DRAFT" status badges regardless of their actual database status. Properties with "PUBLISHED" status in the database are incorrectly showing green badges with "DRAFT" text instead of "PUBLISHED" text. This creates confusion for administrators who cannot distinguish between actual draft properties and published ones. The fix involves correcting the status badge display logic in the admin interface while preserving all existing functionality for mouse clicks, filtering, and API behavior.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when properties with "PUBLISHED" status display "DRAFT" badges
- **Property (P)**: The desired behavior when status badges are displayed - they should show the actual database status
- **Preservation**: Existing mouse-click behavior, filtering logic, and API responses that must remain unchanged by the fix
- **PropertiesPage**: The React component in `app/admin/properties/page.tsx` that renders the property list
- **status**: The property field from the database that determines the publication state ("PUBLISHED", "DRAFT", "UNPUBLISHED")

## Bug Details

### Bug Condition

The bug manifests when the admin properties page renders status badges for properties. The component is either hardcoding the "DRAFT" text in the badge, using a default value instead of the actual property status, or incorrectly mapping the status value to the display text.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type Property with status field
  OUTPUT: boolean
  
  RETURN input.status == 'PUBLISHED'
         AND statusBadgeDisplaysText(input) == 'DRAFT'
         AND propertyExistsInAdminInterface(input)
END FUNCTION
```

### Examples

- Property with status "PUBLISHED" in database shows green badge with "DRAFT" text instead of "PUBLISHED"
- Property with status "PUBLISHED" in database shows green badge with "DRAFT" text in admin properties list
- All properties in admin interface show "DRAFT" regardless of actual database status
- Edge case: Properties with status "UNPUBLISHED" or actual "DRAFT" status should continue showing appropriate badges

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Mouse clicks on property action buttons (Edit, Calendar, Delete) must continue to work exactly as before
- Property filtering and search functionality must remain unchanged
- Quick stats calculations for Published/Draft counts must continue to work correctly

**Scope:**
All functionality that does NOT involve the visual display of status badges should be completely unaffected by this fix. This includes:
- Property CRUD operations (create, read, update, delete)
- API responses and data fetching logic
- Navigation and routing behavior
- Property card layout and styling (except status badge text)

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Hardcoded Badge Text**: The status badge in the JSX template may be hardcoded to display "DRAFT" instead of using the dynamic property.status value
   - The badge component shows `{property.status}` but there may be a hardcoded "DRAFT" string elsewhere
   - The badge styling is correctly using property.status for color but text is hardcoded

2. **Default Value Override**: The component may be setting a default status value that overrides the actual database value
   - Line 31 shows `status: p.status || 'PUBLISHED'` which suggests status handling logic exists
   - There may be incorrect fallback logic that defaults to "DRAFT"

3. **Status Mapping Issue**: There may be incorrect mapping between database status values and display text
   - The status field contains correct values but display logic maps them incorrectly

4. **Template Rendering Issue**: The JSX template may have incorrect property reference or string interpolation
   - The badge shows `{property.status}` but the actual rendered text is "DRAFT"

## Correctness Properties

Property 1: Bug Condition - Status Badge Shows Actual Database Status

_For any_ property where the database status is "PUBLISHED", the admin interface status badge SHALL display "PUBLISHED" text with appropriate styling, allowing administrators to correctly identify published properties.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Non-Status Display Functionality

_For any_ functionality that does NOT involve status badge display (mouse clicks, filtering, API calls, navigation), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing admin interface functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `app/admin/properties/page.tsx`

**Function**: PropertiesPage component JSX template

**Specific Changes**:
1. **Status Badge Text Fix**: Locate the status badge JSX element and ensure it displays `{property.status}` instead of any hardcoded "DRAFT" string
   - Find the badge element around line 120-125 in the JSX template
   - Verify the text content uses the dynamic property.status value

2. **Status Value Verification**: Ensure the property.status value is correctly passed from the API response
   - Verify the loadProperties function correctly maps the status field
   - Check that the default status assignment doesn't override actual values

3. **Badge Styling Consistency**: Ensure badge colors and styling match the actual status values
   - "PUBLISHED" should show green styling
   - "DRAFT" should show appropriate draft styling
   - "UNPUBLISHED" should show appropriate unpublished styling

4. **Template Rendering Check**: Verify JSX string interpolation is working correctly
   - Ensure no template literal issues or incorrect property references
   - Check for any conditional rendering that might override status display

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Create test properties with different status values and verify the admin interface displays incorrect badge text. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Published Property Test**: Create property with status "PUBLISHED" and verify badge shows "DRAFT" (will fail on unfixed code)
2. **Draft Property Test**: Create property with status "DRAFT" and verify badge shows "DRAFT" (should pass on unfixed code)
3. **Unpublished Property Test**: Create property with status "UNPUBLISHED" and verify badge behavior (may fail on unfixed code)
4. **Multiple Status Test**: Create properties with mixed statuses and verify all show "DRAFT" (will fail on unfixed code)

**Expected Counterexamples**:
- Properties with "PUBLISHED" status display "DRAFT" in badge text
- Possible causes: hardcoded string, incorrect property reference, template rendering issue

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL property WHERE isBugCondition(property) DO
  result := renderStatusBadge_fixed(property)
  ASSERT result.displayText = property.status
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL functionality WHERE NOT statusBadgeDisplay(functionality) DO
  ASSERT originalComponent(functionality) = fixedComponent(functionality)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-badge-display functionality

**Test Plan**: Observe behavior on UNFIXED code first for mouse clicks, navigation, and API calls, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Mouse Click Preservation**: Verify clicking Edit, Calendar, Delete buttons continues to work correctly
2. **Navigation Preservation**: Verify property links and routing continue to work correctly
3. **API Call Preservation**: Verify property loading and CRUD operations continue to work correctly
4. **Filtering Preservation**: Verify property filtering and search continue to work correctly

### Unit Tests

- Test status badge rendering for each possible status value ("PUBLISHED", "DRAFT", "UNPUBLISHED")
- Test edge cases (null status, undefined status, invalid status values)
- Test that badge styling matches status values correctly

### Property-Based Tests

- Generate random property objects with various status values and verify badge text matches status
- Generate random admin interface interactions and verify non-badge functionality is preserved
- Test that all property management operations continue to work across many scenarios

### Integration Tests

- Test full admin workflow with status badge display in each context
- Test switching between different property statuses and verifying badge updates
- Test that visual feedback and admin interface behavior remains consistent