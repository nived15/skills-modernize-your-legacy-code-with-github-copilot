#!/bin/bash

# Test script for Account Management System
# This script demonstrates all functionality of the Node.js application

echo "==================================================================="
echo "Testing Account Management System - Node.js Version"
echo "==================================================================="
echo ""

echo "Test 1: View initial balance (should be 1000.00)"
echo "Test 2: Credit 500.00 (balance should become 1500.00)"
echo "Test 3: View balance (should be 1500.00)"
echo "Test 4: Debit 300.00 (balance should become 1200.00)"
echo "Test 5: View balance (should be 1200.00)"
echo "Test 6: Attempt to debit 2000.00 (should fail - insufficient funds)"
echo "Test 7: View balance (should still be 1200.00)"
echo "Test 8: Exit"
echo ""
echo "Starting automated test..."
echo ""

# Run the application with automated input
# Menu choices: 1 (view), 2 (credit), 500, 1 (view), 3 (debit), 300, 1 (view), 3 (debit), 2000, 1 (view), 4 (exit)
echo -e "1\n2\n500\n1\n3\n300\n1\n3\n2000\n1\n4" | node index.js

echo ""
echo "==================================================================="
echo "Test completed!"
echo "==================================================================="
