# Test Plan - Account Management System

## Overview

This test plan covers all business logic and functionality of the COBOL Account Management System. It is designed to validate the current implementation with business stakeholders and serve as a foundation for creating unit and integration tests during the migration to Node.js.

**Application Under Test:** COBOL Account Management System  
**Version:** 1.0  
**Test Plan Date:** December 6, 2025  
**Test Environment:** COBOL Runtime Environment

---

## Test Coverage Areas

1. **Account Initialization**
2. **Menu Navigation and User Interface**
3. **Balance Inquiry Operations**
4. **Credit Transaction Operations**
5. **Debit Transaction Operations**
6. **Data Persistence**
7. **Error Handling and Validation**
8. **Program Flow Control**

---

## Test Cases

### 1. Account Initialization Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-INIT-001 | Verify default account balance initialization | Application not started | 1. Start the application<br>2. Select option 1 (View Balance) | System displays balance of $1,000.00 | | | Initial balance should be exactly $1,000.00 |
| TC-INIT-002 | Verify balance format on initialization | Application not started | 1. Start the application<br>2. Select option 1 (View Balance) | Balance displayed with 2 decimal places (e.g., 1000.00) | | | Format must include cents |

---

### 2. Menu Navigation and User Interface Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-MENU-001 | Verify menu display on application start | Application not started | 1. Start the application | Menu displays with 4 options:<br>1. View Balance<br>2. Credit Account<br>3. Debit Account<br>4. Exit | | | Menu should be clearly formatted |
| TC-MENU-002 | Verify menu option 1 selection | Application running, at menu | 1. Enter "1"<br>2. Press Enter | System calls balance inquiry function and displays current balance | | | Should route to View Balance |
| TC-MENU-003 | Verify menu option 2 selection | Application running, at menu | 1. Enter "2"<br>2. Press Enter | System prompts for credit amount | | | Should route to Credit Account |
| TC-MENU-004 | Verify menu option 3 selection | Application running, at menu | 1. Enter "3"<br>2. Press Enter | System prompts for debit amount | | | Should route to Debit Account |
| TC-MENU-005 | Verify menu option 4 selection (Exit) | Application running, at menu | 1. Enter "4"<br>2. Press Enter | System displays "Exiting the program. Goodbye!" and terminates | | | Clean program termination |
| TC-MENU-006 | Verify invalid menu selection (out of range - high) | Application running, at menu | 1. Enter "5"<br>2. Press Enter | System displays error message "Invalid choice, please select 1-4." and redisplays menu | | | Error handling for invalid input |
| TC-MENU-007 | Verify invalid menu selection (out of range - low) | Application running, at menu | 1. Enter "0"<br>2. Press Enter | System displays error message "Invalid choice, please select 1-4." and redisplays menu | | | Error handling for invalid input |
| TC-MENU-008 | Verify menu redisplay after operation | Application running | 1. Select any valid option (1, 2, or 3)<br>2. Complete the operation | Menu is redisplayed after operation completes | | | Continuous loop until exit |
| TC-MENU-009 | Verify non-numeric menu input handling | Application running, at menu | 1. Enter alphabetic character (e.g., "A")<br>2. Press Enter | System displays error message or handles gracefully | | | Input validation test |

---

### 3. Balance Inquiry Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-BAL-001 | View initial balance | Fresh application start | 1. Select option 1 (View Balance) | System displays "Current balance: 1000.00" | | | Default balance verification |
| TC-BAL-002 | View balance after credit transaction | Balance is $1,000.00 | 1. Credit $500.00<br>2. Select option 1 (View Balance) | System displays "Current balance: 1500.00" | | | Balance reflects credit |
| TC-BAL-003 | View balance after debit transaction | Balance is $1,000.00 | 1. Debit $300.00<br>2. Select option 1 (View Balance) | System displays "Current balance: 700.00" | | | Balance reflects debit |
| TC-BAL-004 | View balance after multiple transactions | Balance is $1,000.00 | 1. Credit $500.00<br>2. Debit $200.00<br>3. Credit $100.00<br>4. Select option 1 (View Balance) | System displays "Current balance: 1400.00" | | | Cumulative balance accuracy |
| TC-BAL-005 | Verify balance precision | Any valid balance state | 1. Perform transaction with cents (e.g., $123.45)<br>2. View balance | Balance displays with exactly 2 decimal places | | | Decimal precision verification |

---

### 4. Credit Transaction Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-CREDIT-001 | Credit account with valid whole number amount | Balance is $1,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "500"<br>3. Press Enter | System displays "Amount credited. New balance: 1500.00" | | | Basic credit operation |
| TC-CREDIT-002 | Credit account with valid decimal amount | Balance is $1,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "250.50"<br>3. Press Enter | System displays "Amount credited. New balance: 1250.50" | | | Credit with cents |
| TC-CREDIT-003 | Credit account with small amount | Balance is $1,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "0.01"<br>3. Press Enter | System displays "Amount credited. New balance: 1000.01" | | | Minimum credit amount |
| TC-CREDIT-004 | Credit account with large amount | Balance is $1,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "50000.00"<br>3. Press Enter | System displays "Amount credited. New balance: 51000.00" | | | Large transaction handling |
| TC-CREDIT-005 | Credit account to approach maximum balance | Balance is $90,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "9999.99"<br>3. Press Enter | System displays "Amount credited. New balance: 99999.99" or handles at maximum | | | Maximum balance limit test |
| TC-CREDIT-006 | Credit account exceeding maximum balance | Balance is $99,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "2000.00"<br>3. Press Enter | System handles overflow (accept or reject based on PIC clause) | | | Boundary condition test |
| TC-CREDIT-007 | Credit with zero amount | Balance is $1,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "0"<br>3. Press Enter | System accepts or rejects based on business rules | | | Edge case - zero credit |
| TC-CREDIT-008 | Credit with negative amount | Balance is $1,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "-100"<br>3. Press Enter | System rejects or handles negative input appropriately | | | Invalid input handling |
| TC-CREDIT-009 | Multiple consecutive credits | Balance is $1,000.00 | 1. Credit $100.00<br>2. Credit $200.00<br>3. Credit $300.00<br>4. View balance | Final balance is $1,600.00 | | | Sequential credit operations |
| TC-CREDIT-010 | Credit with non-numeric input | Balance is $1,000.00 | 1. Select option 2 (Credit Account)<br>2. Enter "ABC"<br>3. Press Enter | System displays error or handles invalid input gracefully | | | Input validation |

---

### 5. Debit Transaction Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-DEBIT-001 | Debit account with valid amount (sufficient funds) | Balance is $1,000.00 | 1. Select option 3 (Debit Account)<br>2. Enter "300"<br>3. Press Enter | System displays "Amount debited. New balance: 700.00" | | | Basic debit operation |
| TC-DEBIT-002 | Debit account with decimal amount | Balance is $1,000.00 | 1. Select option 3 (Debit Account)<br>2. Enter "150.75"<br>3. Press Enter | System displays "Amount debited. New balance: 849.25" | | | Debit with cents |
| TC-DEBIT-003 | Debit exact balance amount | Balance is $1,000.00 | 1. Select option 3 (Debit Account)<br>2. Enter "1000.00"<br>3. Press Enter | System displays "Amount debited. New balance: 0.00" | | | Boundary - exact balance |
| TC-DEBIT-004 | Debit amount exceeding balance | Balance is $1,000.00 | 1. Select option 3 (Debit Account)<br>2. Enter "1500.00"<br>3. Press Enter | System displays "Insufficient funds for this debit." and balance remains $1,000.00 | | | **Critical:** Insufficient funds check |
| TC-DEBIT-005 | Debit amount slightly exceeding balance | Balance is $1,000.00 | 1. Select option 3 (Debit Account)<br>2. Enter "1000.01"<br>3. Press Enter | System displays "Insufficient funds for this debit." and balance remains $1,000.00 | | | Boundary test - just over balance |
| TC-DEBIT-006 | Debit with zero amount | Balance is $1,000.00 | 1. Select option 3 (Debit Account)<br>2. Enter "0"<br>3. Press Enter | System accepts or rejects based on business rules | | | Edge case - zero debit |
| TC-DEBIT-007 | Debit with negative amount | Balance is $1,000.00 | 1. Select option 3 (Debit Account)<br>2. Enter "-100"<br>3. Press Enter | System rejects or handles negative input appropriately | | | Invalid input handling |
| TC-DEBIT-008 | Multiple consecutive debits (sufficient funds) | Balance is $1,000.00 | 1. Debit $100.00<br>2. Debit $200.00<br>3. Debit $150.00<br>4. View balance | Final balance is $550.00 | | | Sequential debit operations |
| TC-DEBIT-009 | Debit after insufficient funds rejection | Balance is $500.00 | 1. Attempt debit of $1,000.00 (rejected)<br>2. Debit $300.00 (valid)<br>3. View balance | First debit rejected, second succeeds. Final balance: $200.00 | | | Recovery from rejection |
| TC-DEBIT-010 | Debit with non-numeric input | Balance is $1,000.00 | 1. Select option 3 (Debit Account)<br>2. Enter "XYZ"<br>3. Press Enter | System displays error or handles invalid input gracefully | | | Input validation |
| TC-DEBIT-011 | Debit from zero balance | Balance is $0.00 | 1. Select option 3 (Debit Account)<br>2. Enter "100.00"<br>3. Press Enter | System displays "Insufficient funds for this debit." | | | No overdraft allowed |

---

### 6. Data Persistence Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-DATA-001 | Verify balance persists during session | Application running, balance is $1,500.00 | 1. Perform several operations<br>2. View balance multiple times | Balance reflects all transactions accurately throughout session | | | In-session persistence |
| TC-DATA-002 | Verify balance read operation | Balance stored as $1,234.56 | 1. Call READ operation via balance inquiry | Returns exact value $1,234.56 | | | Data layer READ function |
| TC-DATA-003 | Verify balance write operation | Balance stored as $1,000.00 | 1. Perform credit of $500.00<br>2. Verify WRITE operation updates storage | Storage balance updated to $1,500.00 | | | Data layer WRITE function |
| TC-DATA-004 | Verify balance resets on program restart | Session ended with balance $2,500.00 | 1. Exit program<br>2. Restart program<br>3. View balance | Balance resets to default $1,000.00 | | | No persistence between sessions |
| TC-DATA-005 | Verify data isolation between operations | Balance is $1,000.00 | 1. Start credit operation (don't complete)<br>2. View balance<br>3. Complete credit | Balance only changes after WRITE operation completes | | | Transaction integrity |

---

### 7. Integration Tests (Inter-Program Communication)

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-INT-001 | Main to Operations CALL (View Balance) | Application running | 1. Select option 1 from main menu | MainProgram successfully calls Operations with 'TOTAL ' parameter | | | Program communication test |
| TC-INT-002 | Main to Operations CALL (Credit) | Application running | 1. Select option 2 from main menu | MainProgram successfully calls Operations with 'CREDIT' parameter | | | Program communication test |
| TC-INT-003 | Main to Operations CALL (Debit) | Application running | 1. Select option 3 from main menu | MainProgram successfully calls Operations with 'DEBIT ' parameter | | | Program communication test |
| TC-INT-004 | Operations to Data CALL (READ) | Performing balance inquiry | 1. Select View Balance | Operations successfully calls DataProgram with 'READ' and receives balance | | | Data layer communication |
| TC-INT-005 | Operations to Data CALL (WRITE) | Performing credit transaction | 1. Credit $500.00 | Operations successfully calls DataProgram with 'WRITE' and new balance | | | Data layer communication |
| TC-INT-006 | GOBACK return from Operations | Any operation in progress | 1. Complete any operation | Operations returns control to MainProgram via GOBACK | | | Return flow test |
| TC-INT-007 | GOBACK return from Data | Data operation in progress | 1. Perform READ or WRITE operation | DataProgram returns control to Operations via GOBACK | | | Return flow test |

---

### 8. Complex Business Scenario Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-SCENARIO-001 | Complete transaction workflow | Fresh application start | 1. View initial balance ($1,000.00)<br>2. Credit $500.00<br>3. View balance ($1,500.00)<br>4. Debit $300.00<br>5. View balance ($1,200.00)<br>6. Exit | All operations succeed with correct balances at each step | | | End-to-end workflow |
| TC-SCENARIO-002 | Insufficient funds workflow | Balance is $200.00 | 1. Attempt debit $500.00 (rejected)<br>2. View balance (still $200.00)<br>3. Credit $400.00<br>4. Debit $500.00 (succeeds)<br>5. View balance ($100.00) | Workflow handles rejection and subsequent success correctly | | | Real-world scenario |
| TC-SCENARIO-003 | Large volume transactions | Balance is $1,000.00 | 1. Perform 10 credits of $100.00 each<br>2. Perform 5 debits of $200.00 each<br>3. View balance | Final balance: $1,000.00 (10×$100 - 5×$200 = $0 net change) | | | Cumulative accuracy |
| TC-SCENARIO-004 | Alternating transactions | Balance is $1,000.00 | 1. Credit $250.00<br>2. Debit $100.00<br>3. Credit $50.00<br>4. Debit $75.00<br>5. View balance | Final balance: $1,125.00 | | | Mixed transaction handling |
| TC-SCENARIO-005 | Balance at limit operations | Balance is $99,999.99 | 1. View balance<br>2. Attempt debit $0.01<br>3. View balance ($99,999.98) | Can debit from maximum balance | | | Maximum balance operations |
| TC-SCENARIO-006 | Recovery from errors | Application running | 1. Enter invalid menu option<br>2. Enter valid option<br>3. Enter invalid transaction amount<br>4. Enter valid amount | System recovers from errors and continues normally | | | Error recovery |

---

### 9. Boundary and Edge Case Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-EDGE-001 | Minimum balance (zero) | Balance is $0.01 | 1. Debit $0.01 | Balance becomes $0.00 | | | Minimum possible balance |
| TC-EDGE-002 | Maximum balance | Balance is $99,999.98 | 1. Credit $0.01 | Balance becomes $99,999.99 or system handles limit | | | Maximum possible balance |
| TC-EDGE-003 | Minimum transaction amount | Balance is $1,000.00 | 1. Credit $0.01 | Balance becomes $1,000.01 | | | Smallest transaction |
| TC-EDGE-004 | Maximum transaction amount | Balance is $0.00 | 1. Credit $99,999.99 | Balance becomes $99,999.99 or system handles limit | | | Largest transaction |
| TC-EDGE-005 | Transaction with many decimal places | Balance is $1,000.00 | 1. Credit $123.456789 | System rounds or truncates to 2 decimals ($1,123.46 or $1,123.45) | | | Decimal handling |

---

### 10. User Experience and Display Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-UX-001 | Menu formatting | Application running | 1. View main menu | Menu is clearly formatted with separators (dashes) and aligned text | | | UI consistency |
| TC-UX-002 | Balance display format | Any balance state | 1. View balance | Balance shown with currency context and 2 decimal places | | | Display formatting |
| TC-UX-003 | Success message display (credit) | Balance is $1,000.00 | 1. Credit $500.00 | System displays confirmation message with new balance | | | User feedback |
| TC-UX-004 | Success message display (debit) | Balance is $1,000.00 | 1. Debit $300.00 | System displays confirmation message with new balance | | | User feedback |
| TC-UX-005 | Error message display | Application running | 1. Enter invalid menu choice | Error message is clear and user-friendly | | | Error messaging |
| TC-UX-006 | Exit message | Application running | 1. Select option 4 (Exit) | Displays "Exiting the program. Goodbye!" | | | Graceful termination |

---

## Test Execution Guidelines

### Pre-Test Preparation
1. Compile COBOL application using: `cobc -x src/cobol/main.cob src/cobol/operations.cob src/cobol/data.cob -o accountsystem`
2. Verify compilation successful
3. Document test environment details

### During Testing
1. Execute test cases in order within each section
2. Document actual results immediately after each test
3. Mark status as Pass/Fail based on comparison with expected results
4. Add detailed comments for any failures or unexpected behavior
5. Take screenshots or logs where applicable

### Post-Test Activities
1. Calculate pass/fail percentages by category
2. Document all defects found
3. Prioritize issues for remediation
4. Schedule re-testing for failed cases after fixes

---

## Success Criteria

- **Critical Tests:** All TC-DEBIT-004, TC-DEBIT-005, TC-DEBIT-011 (insufficient funds protection) must pass
- **Overall Pass Rate:** Minimum 95% of all test cases must pass
- **Data Integrity:** All TC-DATA-* tests must pass
- **Zero Critical Defects:** No defects that result in incorrect balance calculations or data loss

---

## Notes for Node.js Migration

When creating unit and integration tests for the Node.js version:

### Unit Test Priorities
1. **Balance calculation logic** (add, subtract operations)
2. **Insufficient funds validation**
3. **Input validation** (numeric, range checks)
4. **Data formatting** (decimal precision)

### Integration Test Priorities
1. **API endpoint testing** (if creating REST API)
2. **Database operations** (READ/WRITE equivalents)
3. **Session management** (if implementing persistence)
4. **Error handling** and recovery

### Test Framework Recommendations
- **Unit Tests:** Jest or Mocha with Chai
- **Integration Tests:** Supertest (for API) + Jest
- **Test Coverage:** Aim for >90% code coverage
- **Mocking:** Mock database/data layer for unit tests

### Additional Test Considerations for Node.js
1. **Async operation handling**
2. **Database transaction rollback** (if using persistent storage)
3. **Concurrent user sessions** (if multi-user)
4. **API rate limiting** (if applicable)
5. **Authentication/authorization** (if adding security)
6. **Input sanitization** (SQL injection, XSS prevention)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 6, 2025 | GitHub Copilot | Initial test plan creation |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Business Stakeholder | | | |
| QA Lead | | | |
| Development Lead | | | |
| Project Manager | | | |
