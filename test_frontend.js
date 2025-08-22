#!/usr/bin/env node
/**
 * Simple test script to verify the telehealth frontend setup
 */

const fs = require('fs');
const path = require('path');

function checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✓ ${description} exists`);
        return true;
    } else {
        console.log(`❌ ${description} missing: ${filePath}`);
        return false;
    }
}

function validatePackageJson() {
    const packagePath = path.join(__dirname, 'frontend', 'package.json');
    
    try {
        const packageContent = fs.readFileSync(packagePath, 'utf8');
        const packageData = JSON.parse(packageContent);
        
        console.log('\n📦 Package.json validation:');
        console.log(`✓ Package name: ${packageData.name}`);
        console.log(`✓ Version: ${packageData.version}`);
        
        const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
        console.log('\n📋 Required dependencies:');
        
        let allDepsPresent = true;
        for (const dep of requiredDeps) {
            if (packageData.dependencies && packageData.dependencies[dep]) {
                console.log(`✓ ${dep}: ${packageData.dependencies[dep]}`);
            } else {
                console.log(`❌ Missing dependency: ${dep}`);
                allDepsPresent = false;
            }
        }
        
        return allDepsPresent;
    } catch (error) {
        console.log(`❌ Error reading package.json: ${error.message}`);
        return false;
    }
}

function validateFrontendStructure() {
    console.log('🔍 Testing Telehealth Frontend Setup\n');
    
    const checks = [
        ['frontend/package.json', 'Package.json'],
        ['frontend/public/index.html', 'HTML template'],
        ['frontend/src/index.js', 'Main entry point'],
        ['frontend/src/App.js', 'App component'],
        ['frontend/src/App.css', 'App styles'],
        ['frontend/src/contexts/AuthContext.js', 'Auth context'],
        ['frontend/src/components/Login.js', 'Login component'],
        ['frontend/src/components/Register.js', 'Register component'],
        ['frontend/src/components/Dashboard.js', 'Dashboard component'],
        ['frontend/src/components/BookAppointment.js', 'BookAppointment component'],
        ['frontend/src/components/VideoCall.js', 'VideoCall component'],
        ['frontend/src/components/Chat.js', 'Chat component'],
        ['frontend/src/components/PrescriptionForm.js', 'PrescriptionForm component'],
    ];
    
    let allFilesExist = true;
    
    console.log('📁 File structure validation:');
    for (const [filePath, description] of checks) {
        const fullPath = path.join(__dirname, filePath);
        if (!checkFileExists(fullPath, description)) {
            allFilesExist = false;
        }
    }
    
    return allFilesExist;
}

function main() {
    const structureValid = validateFrontendStructure();
    const packageValid = validatePackageJson();
    
    if (structureValid && packageValid) {
        console.log('\n🎉 Frontend setup verification completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Navigate to frontend directory: cd frontend');
        console.log('2. Install dependencies: npm install');
        console.log('3. Start development server: npm start');
    } else {
        console.log('\n⚠️  Frontend setup has issues that need attention.');
    }
}

if (require.main === module) {
    main();
}