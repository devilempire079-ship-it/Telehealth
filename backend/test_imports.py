#!/usr/bin/env python3
"""
Test script to verify that all backend modules can be imported correctly.
This will help identify any remaining syntax or import issues.
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test importing all backend modules."""
    try:
        print("Testing database.py import...")
        import database
        print("✓ database.py imported successfully")
        
        print("Testing models.py import...")
        import models
        print("✓ models.py imported successfully")
        
        print("Testing schemas.py import...")
        import schemas
        print("✓ schemas.py imported successfully")
        
        print("Testing main.py import...")
        import main
        print("✓ main.py imported successfully")
        
        print("\n🎉 All backend modules imported successfully!")
        print("The syntax errors have been fixed.")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Some dependencies may not be installed.")
        print("Run: pip install -r requirements.txt")
    except SyntaxError as e:
        print(f"❌ Syntax error: {e}")
        print("There are still syntax issues in the code.")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_imports()