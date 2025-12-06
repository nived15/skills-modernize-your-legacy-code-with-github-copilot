/**
 * Unit Tests for Account Management System
 * 
 * These tests mirror the COBOL test plan in docs/TESTPLAN.md
 * and validate all business logic of the Node.js application
 * 
 * Test Coverage:
 * 1. Account Initialization
 * 2. Balance Inquiry Operations
 * 3. Credit Transaction Operations
 * 4. Debit Transaction Operations
 * 5. Data Persistence
 * 6. Integration (Inter-Class Communication)
 * 7. Complex Business Scenarios
 * 8. Boundary and Edge Cases
 */

const { DataProgram, Operations, MainProgram } = require('./index');

// Mock readline interface for testing
const createMockReadline = () => {
    const responses = [];
    let responseIndex = 0;

    return {
        question: jest.fn((prompt, callback) => {
            const response = responses[responseIndex++] || '4'; // Default to exit
            callback(response);
        }),
        close: jest.fn(),
        setResponses: (newResponses) => {
            responses.length = 0;
            responses.push(...newResponses);
            responseIndex = 0;
        }
    };
};

describe('Account Management System - Unit Tests', () => {

    // ========================================================================
    // 1. ACCOUNT INITIALIZATION TESTS (TC-INIT-001, TC-INIT-002)
    // ========================================================================

    describe('1. Account Initialization Tests', () => {
        
        test('TC-INIT-001: Verify default account balance initialization', () => {
            // Arrange
            const dataProgram = new DataProgram();
            
            // Act
            const balance = dataProgram.getBalance();
            
            // Assert
            expect(balance).toBe(1000.00);
        });

        test('TC-INIT-002: Verify balance format on initialization', () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            const balance = dataProgram.getBalance();
            const formattedBalance = operations.formatBalance(balance);
            
            // Assert
            expect(formattedBalance).toBe('1000.00');
            expect(formattedBalance).toMatch(/^\d+\.\d{2}$/); // Regex for 2 decimal places
        });
    });

    // ========================================================================
    // 2. BALANCE INQUIRY TESTS (TC-BAL-001 to TC-BAL-005)
    // ========================================================================

    describe('3. Balance Inquiry Tests', () => {

        test('TC-BAL-001: View initial balance', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.viewBalance();
            
            // Assert
            expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1000.00');
            
            // Cleanup
            consoleSpy.mockRestore();
        });

        test('TC-BAL-002: View balance after credit transaction', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['500']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            const balance = dataProgram.getBalance();
            
            // Assert
            expect(balance).toBe(1500.00);
        });

        test('TC-BAL-003: View balance after debit transaction', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['300']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.debitAccount();
            const balance = dataProgram.getBalance();
            
            // Assert
            expect(balance).toBe(700.00);
        });

        test('TC-BAL-004: View balance after multiple transactions', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            mockRl.setResponses(['500']);
            await operations.creditAccount(); // +500 = 1500
            
            mockRl.setResponses(['200']);
            await operations.debitAccount(); // -200 = 1300
            
            mockRl.setResponses(['100']);
            await operations.creditAccount(); // +100 = 1400
            
            const balance = dataProgram.getBalance();
            
            // Assert
            expect(balance).toBe(1400.00);
        });

        test('TC-BAL-005: Verify balance precision with cents', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['123.45']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            const balance = dataProgram.getBalance();
            const formattedBalance = operations.formatBalance(balance);
            
            // Assert
            expect(balance).toBe(1123.45);
            expect(formattedBalance).toBe('1123.45');
            expect(formattedBalance).toMatch(/^\d+\.\d{2}$/);
        });
    });

    // ========================================================================
    // 3. CREDIT TRANSACTION TESTS (TC-CREDIT-001 to TC-CREDIT-010)
    // ========================================================================

    describe('4. Credit Transaction Tests', () => {

        test('TC-CREDIT-001: Credit account with valid whole number amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['500']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1500.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
            
            consoleSpy.mockRestore();
        });

        test('TC-CREDIT-002: Credit account with valid decimal amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['250.50']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1250.50);
        });

        test('TC-CREDIT-003: Credit account with small amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.01);
        });

        test('TC-CREDIT-004: Credit account with large amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['50000.00']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(51000.00);
        });

        test('TC-CREDIT-005: Credit account to approach maximum balance', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(90000.00);
            const mockRl = createMockReadline();
            mockRl.setResponses(['9999.99']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(99999.99);
        });

        test('TC-CREDIT-007: Credit with zero amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['0']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.00); // Balance unchanged
        });

        test('TC-CREDIT-008: Credit with negative amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['-100']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            
            consoleSpy.mockRestore();
        });

        test('TC-CREDIT-009: Multiple consecutive credits', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            mockRl.setResponses(['100']);
            await operations.creditAccount(); // 1100
            
            mockRl.setResponses(['200']);
            await operations.creditAccount(); // 1300
            
            mockRl.setResponses(['300']);
            await operations.creditAccount(); // 1600
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1600.00);
        });

        test('TC-CREDIT-010: Credit with non-numeric input', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['ABC']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            
            consoleSpy.mockRestore();
        });
    });

    // ========================================================================
    // 4. DEBIT TRANSACTION TESTS (TC-DEBIT-001 to TC-DEBIT-011)
    // ========================================================================

    describe('5. Debit Transaction Tests', () => {

        test('TC-DEBIT-001: Debit account with valid amount (sufficient funds)', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['300']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(700.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 700.00');
            
            consoleSpy.mockRestore();
        });

        test('TC-DEBIT-002: Debit account with decimal amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['150.75']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(849.25);
        });

        test('TC-DEBIT-003: Debit exact balance amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['1000.00']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(0.00);
        });

        test('TC-DEBIT-004: Debit amount exceeding balance (CRITICAL)', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['1500.00']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });

        test('TC-DEBIT-005: Debit amount slightly exceeding balance', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['1000.01']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });

        test('TC-DEBIT-006: Debit with zero amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['0']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.00); // Balance unchanged
        });

        test('TC-DEBIT-007: Debit with negative amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['-100']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            
            consoleSpy.mockRestore();
        });

        test('TC-DEBIT-008: Multiple consecutive debits (sufficient funds)', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            mockRl.setResponses(['100']);
            await operations.debitAccount(); // 900
            
            mockRl.setResponses(['200']);
            await operations.debitAccount(); // 700
            
            mockRl.setResponses(['150']);
            await operations.debitAccount(); // 550
            
            // Assert
            expect(dataProgram.getBalance()).toBe(550.00);
        });

        test('TC-DEBIT-009: Debit after insufficient funds rejection', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(500.00);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            mockRl.setResponses(['1000']);
            await operations.debitAccount(); // Rejected, balance stays 500
            
            mockRl.setResponses(['300']);
            await operations.debitAccount(); // Success, balance becomes 200
            
            // Assert
            expect(dataProgram.getBalance()).toBe(200.00);
        });

        test('TC-DEBIT-010: Debit with non-numeric input', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['XYZ']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            
            consoleSpy.mockRestore();
        });

        test('TC-DEBIT-011: Debit from zero balance', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(0.00);
            const mockRl = createMockReadline();
            mockRl.setResponses(['100']);
            const operations = new Operations(dataProgram, mockRl);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(0.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });
    });

    // ========================================================================
    // 5. DATA PERSISTENCE TESTS (TC-DATA-001 to TC-DATA-005)
    // ========================================================================

    describe('6. Data Persistence Tests', () => {

        test('TC-DATA-001: Verify balance persists during session', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act - Multiple operations
            mockRl.setResponses(['500']);
            await operations.creditAccount(); // 1500
            
            let balance1 = dataProgram.getBalance();
            
            mockRl.setResponses(['200']);
            await operations.debitAccount(); // 1300
            
            let balance2 = dataProgram.getBalance();
            
            mockRl.setResponses(['100']);
            await operations.creditAccount(); // 1400
            
            let balance3 = dataProgram.getBalance();
            
            // Assert
            expect(balance1).toBe(1500.00);
            expect(balance2).toBe(1300.00);
            expect(balance3).toBe(1400.00);
        });

        test('TC-DATA-002: Verify balance read operation', () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(1234.56);
            
            // Act
            const balance = dataProgram.execute('READ');
            
            // Assert
            expect(balance).toBe(1234.56);
        });

        test('TC-DATA-003: Verify balance write operation', () => {
            // Arrange
            const dataProgram = new DataProgram();
            
            // Act
            dataProgram.execute('WRITE', 1500.00);
            const balance = dataProgram.getBalance();
            
            // Assert
            expect(balance).toBe(1500.00);
        });

        test('TC-DATA-004: Verify balance resets on program restart', () => {
            // Arrange & Act - Simulate program restart with new instance
            const dataProgram1 = new DataProgram();
            dataProgram1.setBalance(2500.00);
            
            // Simulate restart
            const dataProgram2 = new DataProgram();
            const balance = dataProgram2.getBalance();
            
            // Assert
            expect(balance).toBe(1000.00); // Reset to default
        });

        test('TC-DATA-005: Verify data isolation between operations', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            const balanceBefore = dataProgram.getBalance();
            
            // Balance should not change during incomplete operations
            // Only changes after WRITE operation completes
            mockRl.setResponses(['500']);
            await operations.creditAccount();
            
            const balanceAfter = dataProgram.getBalance();
            
            // Assert
            expect(balanceBefore).toBe(1000.00);
            expect(balanceAfter).toBe(1500.00);
        });
    });

    // ========================================================================
    // 6. INTEGRATION TESTS (TC-INT-001 to TC-INT-007)
    // ========================================================================

    describe('7. Integration Tests (Inter-Class Communication)', () => {

        test('TC-INT-004: Operations to Data CALL (READ)', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.viewBalance();
            
            // Assert - Verify READ was successful (no error thrown)
            expect(dataProgram.getBalance()).toBe(1000.00);
        });

        test('TC-INT-005: Operations to Data CALL (WRITE)', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['500']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert - Verify WRITE was successful
            expect(dataProgram.getBalance()).toBe(1500.00);
        });
    });

    // ========================================================================
    // 7. COMPLEX BUSINESS SCENARIO TESTS (TC-SCENARIO-001 to TC-SCENARIO-006)
    // ========================================================================

    describe('8. Complex Business Scenario Tests', () => {

        test('TC-SCENARIO-001: Complete transaction workflow', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act & Assert - Step by step workflow
            // Step 1: View initial balance
            let balance = dataProgram.getBalance();
            expect(balance).toBe(1000.00);
            
            // Step 2: Credit $500
            mockRl.setResponses(['500']);
            await operations.creditAccount();
            balance = dataProgram.getBalance();
            expect(balance).toBe(1500.00);
            
            // Step 3: View balance
            await operations.viewBalance();
            balance = dataProgram.getBalance();
            expect(balance).toBe(1500.00);
            
            // Step 4: Debit $300
            mockRl.setResponses(['300']);
            await operations.debitAccount();
            balance = dataProgram.getBalance();
            expect(balance).toBe(1200.00);
            
            // Step 5: View balance
            await operations.viewBalance();
            balance = dataProgram.getBalance();
            expect(balance).toBe(1200.00);
        });

        test('TC-SCENARIO-002: Insufficient funds workflow', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(200.00);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            // Step 1: Attempt debit $500 (rejected)
            mockRl.setResponses(['500']);
            await operations.debitAccount();
            expect(dataProgram.getBalance()).toBe(200.00);
            
            // Step 2: View balance (still $200)
            await operations.viewBalance();
            expect(dataProgram.getBalance()).toBe(200.00);
            
            // Step 3: Credit $400
            mockRl.setResponses(['400']);
            await operations.creditAccount();
            expect(dataProgram.getBalance()).toBe(600.00);
            
            // Step 4: Debit $500 (succeeds)
            mockRl.setResponses(['500']);
            await operations.debitAccount();
            expect(dataProgram.getBalance()).toBe(100.00);
            
            // Step 5: View balance ($100)
            await operations.viewBalance();
            expect(dataProgram.getBalance()).toBe(100.00);
        });

        test('TC-SCENARIO-003: Large volume transactions', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            // Perform 10 credits of $100 each
            for (let i = 0; i < 10; i++) {
                mockRl.setResponses(['100']);
                await operations.creditAccount();
            }
            
            // Perform 5 debits of $200 each
            for (let i = 0; i < 5; i++) {
                mockRl.setResponses(['200']);
                await operations.debitAccount();
            }
            
            const finalBalance = dataProgram.getBalance();
            
            // Assert
            // 1000 + (10 * 100) - (5 * 200) = 1000 + 1000 - 1000 = 1000
            expect(finalBalance).toBe(1000.00);
        });

        test('TC-SCENARIO-004: Alternating transactions', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            mockRl.setResponses(['250']);
            await operations.creditAccount(); // +250 = 1250
            
            mockRl.setResponses(['100']);
            await operations.debitAccount(); // -100 = 1150
            
            mockRl.setResponses(['50']);
            await operations.creditAccount(); // +50 = 1200
            
            mockRl.setResponses(['75']);
            await operations.debitAccount(); // -75 = 1125
            
            const finalBalance = dataProgram.getBalance();
            
            // Assert
            expect(finalBalance).toBe(1125.00);
        });

        test('TC-SCENARIO-005: Balance at limit operations', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(99999.99);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            mockRl.setResponses(['0.01']);
            await operations.debitAccount();
            
            const balance = dataProgram.getBalance();
            
            // Assert
            expect(balance).toBe(99999.98);
        });
    });

    // ========================================================================
    // 8. BOUNDARY AND EDGE CASE TESTS (TC-EDGE-001 to TC-EDGE-005)
    // ========================================================================

    describe('9. Boundary and Edge Case Tests', () => {

        test('TC-EDGE-001: Minimum balance (zero)', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(0.01);
            const mockRl = createMockReadline();
            mockRl.setResponses(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.debitAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(0.00);
        });

        test('TC-EDGE-002: Maximum balance', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(99999.98);
            const mockRl = createMockReadline();
            mockRl.setResponses(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(99999.99);
        });

        test('TC-EDGE-003: Minimum transaction amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(1000.01);
        });

        test('TC-EDGE-004: Maximum transaction amount', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            dataProgram.setBalance(0.00);
            const mockRl = createMockReadline();
            mockRl.setResponses(['99999.99']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            
            // Assert
            expect(dataProgram.getBalance()).toBe(99999.99);
        });

        test('TC-EDGE-005: Transaction with many decimal places', async () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            mockRl.setResponses(['123.456789']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Act
            await operations.creditAccount();
            const balance = dataProgram.getBalance();
            
            // Assert
            // Should round to 2 decimal places
            expect(balance).toBe(1123.46); // Rounded
        });
    });

    // ========================================================================
    // 9. UTILITY FUNCTION TESTS
    // ========================================================================

    describe('10. Utility Function Tests', () => {

        test('formatBalance: Formats number to 2 decimal places', () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act & Assert
            expect(operations.formatBalance(1000)).toBe('1000.00');
            expect(operations.formatBalance(1234.5)).toBe('1234.50');
            expect(operations.formatBalance(999.99)).toBe('999.99');
            expect(operations.formatBalance(0)).toBe('0.00');
        });

        test('roundToTwoDecimals: Rounds to 2 decimal places', () => {
            // Arrange
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Act & Assert
            expect(operations.roundToTwoDecimals(123.456)).toBe(123.46);
            expect(operations.roundToTwoDecimals(123.454)).toBe(123.45);
            expect(operations.roundToTwoDecimals(123.455)).toBe(123.46);
            expect(operations.roundToTwoDecimals(100)).toBe(100);
        });
    });
});
