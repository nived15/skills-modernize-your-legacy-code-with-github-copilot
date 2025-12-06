# Account Management System - Node.js Version

## Overview

This is a Node.js application converted from the legacy COBOL Account Management System. It preserves all original business logic, data integrity, and menu options from the COBOL implementation.

## Original COBOL Files Converted

- **main.cob** → `MainProgram` class (User interface and program flow control)
- **operations.cob** → `Operations` class (Business logic for account operations)  
- **data.cob** → `DataProgram` class (Data persistence layer)

## Features

✅ **View Balance** - Display current account balance  
✅ **Credit Account** - Add funds to the account  
✅ **Debit Account** - Remove funds with insufficient funds validation  
✅ **Data Integrity** - All amounts handled with 2 decimal precision  
✅ **Business Logic Preserved** - Identical behavior to COBOL version

## Prerequisites

- Node.js version 14.0.0 or higher
- npm (Node Package Manager)

## Installation

```bash
cd src/accounting
npm install
```

## Running the Application

### Method 1: Command Line

```bash
cd src/accounting
npm start
```

Or directly:

```bash
cd src/accounting
node index.js
```

### Method 2: VS Code Debug/Run

1. Open VS Code
2. Press `F5` or go to Run → Start Debugging
3. Select "Run Account Management System" from the dropdown

The application will start in the integrated terminal.

### Method 3: VS Code Run and Debug Panel

1. Open the Run and Debug panel (Ctrl+Shift+D / Cmd+Shift+D)
2. Select "Run Account Management System" configuration
3. Click the green play button

## Usage

Once the application starts, you'll see the main menu:

```
--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4):
```

### Menu Options

**1. View Balance**
- Displays current account balance
- Format: `Current balance: XXXX.XX`

**2. Credit Account**
- Prompts for amount to credit
- Adds funds to the account
- Displays new balance
- Example:
  ```
  Enter credit amount: 500
  Amount credited. New balance: 1500.00
  ```

**3. Debit Account**
- Prompts for amount to debit
- Validates sufficient funds
- If sufficient: Deducts amount and displays new balance
- If insufficient: Displays error message and balance remains unchanged
- Example (success):
  ```
  Enter debit amount: 300
  Amount debited. New balance: 700.00
  ```
- Example (failure):
  ```
  Enter debit amount: 2000
  Insufficient funds for this debit.
  ```

**4. Exit**
- Exits the application
- Displays: `Exiting the program. Goodbye!`

## Business Rules

### Account Initialization
- Default starting balance: **$1,000.00**
- Balance persists during application session
- Balance resets to $1,000.00 on restart (in-memory storage)

### Transaction Validation
- **Credit Operations**: Always succeed if valid amount provided
- **Debit Operations**: Only succeed if `balance >= debit amount`
- **Insufficient Funds**: Debit rejected, balance unchanged
- **No Overdraft**: System does not allow negative balances

### Data Precision
- All amounts stored with 2 decimal places
- Matches COBOL `PIC 9(6)V99` format
- Maximum value: $999,999.99
- Currency precision preserved throughout operations

## Architecture

The application follows a three-tier architecture matching the original COBOL structure:

```
┌─────────────────────────────────────┐
│      MainProgram (main.cob)         │
│  • User Interface                   │
│  • Menu Display & Navigation        │
│  • Program Flow Control             │
└──────────────┬──────────────────────┘
               │ CALL
               ▼
┌─────────────────────────────────────┐
│      Operations (operations.cob)    │
│  • Business Logic                   │
│  • Balance Inquiry                  │
│  • Credit Transactions              │
│  • Debit Transactions               │
│  • Insufficient Funds Validation    │
└──────────────┬──────────────────────┘
               │ CALL
               ▼
┌─────────────────────────────────────┐
│      DataProgram (data.cob)         │
│  • Data Persistence                 │
│  • Balance Storage                  │
│  • READ Operations                  │
│  • WRITE Operations                 │
└─────────────────────────────────────┘
```

## Code Structure

```javascript
// Data Layer
class DataProgram {
    execute(operationType, balance)  // READ or WRITE operations
    getBalance()                     // Convenience method for READ
    setBalance(newBalance)           // Convenience method for WRITE
}

// Business Logic Layer
class Operations {
    execute(operationType)           // Main entry point
    viewBalance()                    // TOTAL operation
    creditAccount()                  // CREDIT operation
    debitAccount()                   // DEBIT operation
}

// Presentation Layer
class MainProgram {
    run()                           // Main program loop
    displayMenu()                   // Show menu options
    processChoice(userChoice)       // Handle user selection
}
```

## Testing

The application has been tested to ensure it matches the COBOL version's behavior:

- ✅ Initial balance displays correctly ($1,000.00)
- ✅ Credit operations add funds accurately
- ✅ Debit operations subtract funds correctly
- ✅ Insufficient funds protection works
- ✅ Balance precision maintained (2 decimals)
- ✅ Menu navigation functions properly
- ✅ Invalid input handled gracefully
- ✅ Exit closes application cleanly

## Differences from COBOL Version

### Similarities (100% Business Logic Preserved)
- Identical menu structure
- Same default balance ($1,000.00)
- Identical transaction logic
- Same insufficient funds validation
- Matching decimal precision
- Equivalent program flow

### Technical Differences
- **Async I/O**: Node.js uses asynchronous operations for user input
- **Classes**: Object-oriented structure vs. COBOL programs
- **Promises**: Async/await for handling user input
- **No compilation**: Interpreted JavaScript vs. compiled COBOL

## Development

### Available npm Scripts

```bash
npm start       # Run the application
npm run dev     # Run with debugging enabled
npm test        # Run tests (when implemented)
```

### Debugging

Use the VS Code debugger with the provided launch configuration:
- Set breakpoints in `index.js`
- Press F5 to start debugging
- Step through code execution
- Inspect variables and call stack

## Migration Notes

This application was created as part of the legacy COBOL modernization effort. Key considerations:

1. **Business Logic**: Completely preserved from COBOL
2. **Data Flow**: Matches sequence diagram in `docs/README.md`
3. **Test Plan**: See `docs/TESTPLAN.md` for comprehensive testing
4. **Future Enhancements**:
   - Add persistent storage (database)
   - Implement REST API
   - Add user authentication
   - Create web interface
   - Add transaction history
   - Implement unit tests

## Support

For issues or questions, refer to:
- Original COBOL documentation: `docs/README.md`
- Test plan: `docs/TESTPLAN.md`
- Sequence diagram in documentation

## License

ISC
