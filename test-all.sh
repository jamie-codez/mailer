#!/bin/bash

# Script to run all tests for the mailer library

echo "Running unit tests..."
npm test

echo -e "\nRunning integration tests..."
npx jest --testRegex=".*\.integration\.spec\.ts$" --rootDir=.

echo -e "\nRunning e2e tests..."
npm run test:e2e

echo -e "\nAll tests completed!"
