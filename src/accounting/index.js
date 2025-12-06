/**
 * Account Management System - Node.js Version
 * 
 * Converted from COBOL legacy application
 * Preserves original business logic, data integrity, and menu options
 * 
 * Original files:
 * - main.cob: User interface and program flow control
 * - operations.cob: Business logic for account operations
 * - data.cob: Data persistence layer
 */

const readline = require('readline');

// ============================================================================
// DATA LAYER (equivalent to data.cob)
// ============================================================================

/**
 * DataProgram - Manages data persistence and provides abstraction for balance storage
 * Equivalent to DataProgram in data.cob
 */
class DataProgram {
    constructor() {
        // STORAGE-BALANCE PIC 9(6)V99 VALUE 1000.00
        this.storageBalance = 1000.00;
    }

    /**
     * Performs READ or WRITE operations on the balance
     * @param {string} operationType - 'READ' or 'WRITE'
     * @param {number|null} balance - Balance value (used for WRITE operations)
     * @returns {number|null} - Returns balance for READ operations, null for WRITE
     */
    execute(operationType, balance = null) {
        if (operationType === 'READ') {
            // MOVE STORAGE-BALANCE TO BALANCE
            return this.storageBalance;
        } else if (operationType === 'WRITE') {
            // MOVE BALANCE TO STORAGE-BALANCE
            this.storageBalance = balance;
            return null;
        }
        return null;
    }

    /**
     * Get current balance (convenience method)
     * @returns {number}
     */
    getBalance() {
        return this.execute('READ');
    }

    /**
     * Update balance (convenience method)
     * @param {number} newBalance
     */
    setBalance(newBalance) {
        this.execute('WRITE', newBalance);
    }
}

// ============================================================================
// OPERATIONS LAYER (equivalent to operations.cob)
// ============================================================================

/**
 * Operations - Implements business logic for account operations
 * Equivalent to Operations program in operations.cob
 */
class Operations {
    constructor(dataProgram, rl) {
        this.dataProgram = dataProgram;
        this.rl = rl;
    }

    /**
     * Main entry point for operations
     * @param {string} operationType - 'TOTAL ', 'CREDIT', or 'DEBIT '
     * @returns {Promise<void>}
     */
    async execute(operationType) {
        if (operationType === 'TOTAL ') {
            await this.viewBalance();
        } else if (operationType === 'CREDIT') {
            await this.creditAccount();
        } else if (operationType === 'DEBIT ') {
            await this.debitAccount();
        }
    }

    /**
     * View Balance - Displays current account balance
     * Equivalent to TOTAL operation in operations.cob
     */
    async viewBalance() {
        // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        const balance = this.dataProgram.getBalance();
        
        // DISPLAY "Current balance: " FINAL-BALANCE
        console.log(`Current balance: ${this.formatBalance(balance)}`);
    }

    /**
     * Credit Account - Adds funds to the account
     * Equivalent to CREDIT operation in operations.cob
     */
    async creditAccount() {
        // DISPLAY "Enter credit amount: "
        const amount = await this.promptForAmount('Enter credit amount: ');
        
        if (amount === null || amount < 0) {
            console.log('Invalid amount. Please enter a positive number.');
            return;
        }

        // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        let finalBalance = this.dataProgram.getBalance();
        
        // ADD AMOUNT TO FINAL-BALANCE
        finalBalance = this.roundToTwoDecimals(finalBalance + amount);
        
        // CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
        this.dataProgram.setBalance(finalBalance);
        
        // DISPLAY "Amount credited. New balance: " FINAL-BALANCE
        console.log(`Amount credited. New balance: ${this.formatBalance(finalBalance)}`);
    }

    /**
     * Debit Account - Removes funds from account with validation
     * Equivalent to DEBIT operation in operations.cob
     */
    async debitAccount() {
        // DISPLAY "Enter debit amount: "
        const amount = await this.promptForAmount('Enter debit amount: ');
        
        if (amount === null || amount < 0) {
            console.log('Invalid amount. Please enter a positive number.');
            return;
        }

        // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        let finalBalance = this.dataProgram.getBalance();
        
        // IF FINAL-BALANCE >= AMOUNT
        if (finalBalance >= amount) {
            // SUBTRACT AMOUNT FROM FINAL-BALANCE
            finalBalance = this.roundToTwoDecimals(finalBalance - amount);
            
            // CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
            this.dataProgram.setBalance(finalBalance);
            
            // DISPLAY "Amount debited. New balance: " FINAL-BALANCE
            console.log(`Amount debited. New balance: ${this.formatBalance(finalBalance)}`);
        } else {
            // DISPLAY "Insufficient funds for this debit."
            console.log('Insufficient funds for this debit.');
        }
    }

    /**
     * Prompts user for amount input
     * @param {string} prompt - The prompt message
     * @returns {Promise<number|null>}
     */
    async promptForAmount(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                const amount = parseFloat(answer);
                if (isNaN(amount)) {
                    resolve(null);
                } else {
                    resolve(this.roundToTwoDecimals(amount));
                }
            });
        });
    }

    /**
     * Formats balance to match COBOL display format (2 decimal places)
     * @param {number} balance
     * @returns {string}
     */
    formatBalance(balance) {
        return balance.toFixed(2);
    }

    /**
     * Rounds number to 2 decimal places to match COBOL PIC 9(6)V99
     * @param {number} value
     * @returns {number}
     */
    roundToTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }
}

// ============================================================================
// MAIN PROGRAM (equivalent to main.cob)
// ============================================================================

/**
 * MainProgram - User interface and program flow control
 * Equivalent to MainProgram in main.cob
 */
class MainProgram {
    constructor() {
        // Initialize readline interface for user input
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Initialize data layer
        this.dataProgram = new DataProgram();

        // Initialize operations layer
        this.operations = new Operations(this.dataProgram, this.rl);

        // CONTINUE-FLAG PIC X(3) VALUE 'YES'
        this.continueFlag = 'YES';
    }

    /**
     * Main program logic loop
     * Equivalent to MAIN-LOGIC in main.cob
     */
    async run() {
        // PERFORM UNTIL CONTINUE-FLAG = 'NO'
        while (this.continueFlag === 'YES') {
            await this.displayMenuAndProcess();
        }

        // DISPLAY "Exiting the program. Goodbye!"
        console.log('Exiting the program. Goodbye!');
        
        // Close readline interface
        this.rl.close();
    }

    /**
     * Displays menu and processes user choice
     */
    async displayMenuAndProcess() {
        // Display menu
        this.displayMenu();

        // Get user choice
        const userChoice = await this.getUserChoice();

        // Process choice
        await this.processChoice(userChoice);
    }

    /**
     * Displays the main menu
     * Matches COBOL menu display exactly
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    /**
     * Gets user's menu choice
     * @returns {Promise<number>}
     */
    async getUserChoice() {
        return new Promise((resolve) => {
            this.rl.question('Enter your choice (1-4): ', (answer) => {
                const choice = parseInt(answer);
                resolve(isNaN(choice) ? 0 : choice);
            });
        });
    }

    /**
     * Processes user's menu selection
     * Equivalent to EVALUATE USER-CHOICE in main.cob
     * @param {number} userChoice
     */
    async processChoice(userChoice) {
        // EVALUATE USER-CHOICE
        switch (userChoice) {
            case 1:
                // WHEN 1: CALL 'Operations' USING 'TOTAL '
                await this.operations.execute('TOTAL ');
                break;
            
            case 2:
                // WHEN 2: CALL 'Operations' USING 'CREDIT'
                await this.operations.execute('CREDIT');
                break;
            
            case 3:
                // WHEN 3: CALL 'Operations' USING 'DEBIT '
                await this.operations.execute('DEBIT ');
                break;
            
            case 4:
                // WHEN 4: MOVE 'NO' TO CONTINUE-FLAG
                this.continueFlag = 'NO';
                break;
            
            default:
                // WHEN OTHER: DISPLAY "Invalid choice, please select 1-4."
                console.log('Invalid choice, please select 1-4.');
                break;
        }
    }
}

// ============================================================================
// APPLICATION ENTRY POINT
// ============================================================================

/**
 * Main entry point
 * Starts the Account Management System
 */
async function main() {
    const app = new MainProgram();
    await app.run();
}

// Run the application
if (require.main === module) {
    main().catch((error) => {
        console.error('An error occurred:', error);
        process.exit(1);
    });
}

// Export for testing purposes
module.exports = {
    MainProgram,
    Operations,
    DataProgram
};
