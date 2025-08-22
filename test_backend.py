#!/usr/bin/env python3
"""
Simple test script to verify the telehealth backend setup
"""

import sys
import os

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

def test_imports():
    """Test if all modules can be imported successfully."""
    try:
        print("Testing imports...")
        
        # Test database module
        print("✓ Importing database module...")
        import database
        
        # Test models module
        print("✓ Importing models module...")
        import models
        
        # Test schemas module
        print("✓ Importing schemas module...")
        import schemas
        
        # Test main application
        print("✓ Importing main application...")
        import main
        
        print("\n✅ All modules imported successfully!")
        return True
        
    except ImportError as e:
        print(f"\n❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False

def test_fastapi_app():
    """Test if FastAPI app can be created."""
    try:
        from main import app
        print("✓ FastAPI app created successfully")
        print(f"✓ App title: {app.title}")
        return True
    except Exception as e:
        print(f"❌ FastAPI app creation failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🔍 Testing Telehealth Backend Setup\n")
    
    # Test 1: Module imports
    imports_ok = test_imports()
    
    if imports_ok:
        # Test 2: FastAPI app
        app_ok = test_fastapi_app()
        
        if app_ok:
            print("\n🎉 Backend setup verification completed successfully!")
            print("\nNext steps:")
            print("1. Install dependencies: pip install -r backend/requirements.txt")
            print("2. Set up PostgreSQL database")
            print("3. Run the backend: uvicorn main:app --reload")
        else:
            print("\n⚠️  Backend setup has issues that need attention.")
    else:
        print("\n❌ Backend setup failed. Please check dependencies and file structure.")

if __name__ == "__main__":
    main()