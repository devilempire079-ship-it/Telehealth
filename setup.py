#!/usr/bin/env python3
"""
Telehealth MVP Setup Script
Helps users set up the telehealth application step by step
"""

import os
import sys
import subprocess
import platform

def print_header(title):
    """Print a formatted header."""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def print_step(step_num, description):
    """Print a formatted step."""
    print(f"\n📌 Step {step_num}: {description}")
    print("-" * 50)

def check_command_exists(command):
    """Check if a command exists in the system."""
    try:
        subprocess.run([command, "--version"], 
                      capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def run_command(command, description, cwd=None):
    """Run a command and display the result."""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {description} failed")
            print(f"   Error: {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ {description} failed with exception: {e}")
        return False

def check_prerequisites():
    """Check if required tools are installed."""
    print_step(1, "Checking Prerequisites")
    
    required_tools = {
        'python': 'Python',
        'node': 'Node.js',
        'npm': 'npm (Node Package Manager)',
    }
    
    optional_tools = {
        'docker': 'Docker',
        'psql': 'PostgreSQL client'
    }
    
    all_required = True
    
    print("🔍 Checking required tools:")
    for command, name in required_tools.items():
        if check_command_exists(command):
            # Get version
            try:
                result = subprocess.run([command, "--version"], 
                                      capture_output=True, text=True)
                version = result.stdout.strip().split('\n')[0]
                print(f"✅ {name}: {version}")
            except:
                print(f"✅ {name}: Available")
        else:
            print(f"❌ {name}: Not found")
            all_required = False
    
    print("\n🔍 Checking optional tools:")
    for command, name in optional_tools.items():
        if check_command_exists(command):
            print(f"✅ {name}: Available")
        else:
            print(f"⚠️  {name}: Not found (optional for Docker setup)")
    
    return all_required

def setup_backend():
    """Set up the backend environment."""
    print_step(2, "Setting up Backend")
    
    backend_dir = os.path.join(os.getcwd(), 'backend')
    
    if not os.path.exists(backend_dir):
        print("❌ Backend directory not found!")
        return False
    
    print("🐍 Setting up Python virtual environment...")
    
    # Create virtual environment
    venv_path = os.path.join(backend_dir, 'venv')
    if not os.path.exists(venv_path):
        if not run_command('python -m venv venv', 
                          'Creating virtual environment', backend_dir):
            return False
    else:
        print("✅ Virtual environment already exists")
    
    # Determine activation script path based on OS
    if platform.system() == "Windows":
        activate_script = os.path.join(venv_path, 'Scripts', 'activate.bat')
        pip_path = os.path.join(venv_path, 'Scripts', 'pip.exe')
    else:
        activate_script = os.path.join(venv_path, 'bin', 'activate')
        pip_path = os.path.join(venv_path, 'bin', 'pip')
    
    # Install requirements
    requirements_path = os.path.join(backend_dir, 'requirements.txt')
    if os.path.exists(requirements_path):
        install_cmd = f'"{pip_path}" install -r requirements.txt'
        if not run_command(install_cmd, 'Installing Python dependencies', backend_dir):
            print("⚠️  Failed to install dependencies. You may need to run this manually:")
            print(f"   cd backend && {install_cmd}")
    else:
        print("❌ requirements.txt not found!")
        return False
    
    return True

def setup_frontend():
    """Set up the frontend environment."""
    print_step(3, "Setting up Frontend")
    
    frontend_dir = os.path.join(os.getcwd(), 'frontend')
    
    if not os.path.exists(frontend_dir):
        print("❌ Frontend directory not found!")
        return False
    
    # Install npm dependencies
    package_json_path = os.path.join(frontend_dir, 'package.json')
    if os.path.exists(package_json_path):
        if not run_command('npm install', 'Installing Node.js dependencies', frontend_dir):
            print("⚠️  Failed to install dependencies. You may need to run this manually:")
            print("   cd frontend && npm install")
            return False
    else:
        print("❌ package.json not found!")
        return False
    
    return True

def create_env_files():
    """Create environment files with example configurations."""
    print_step(4, "Creating Environment Configuration")
    
    # Backend .env example
    backend_env = """# Backend Environment Variables
DATABASE_URL=postgresql://postgres:password@localhost:5432/telehealth
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
"""
    
    backend_env_path = os.path.join('backend', '.env.example')
    try:
        with open(backend_env_path, 'w') as f:
            f.write(backend_env)
        print(f"✅ Created {backend_env_path}")
    except Exception as e:
        print(f"❌ Failed to create {backend_env_path}: {e}")
    
    # Frontend .env example
    frontend_env = """# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:8000
"""
    
    frontend_env_path = os.path.join('frontend', '.env.example')
    try:
        with open(frontend_env_path, 'w') as f:
            f.write(frontend_env)
        print(f"✅ Created {frontend_env_path}")
    except Exception as e:
        print(f"❌ Failed to create {frontend_env_path}: {e}")

def display_next_steps():
    """Display the next steps for the user."""
    print_step(5, "Next Steps")
    
    print("""
🚀 Your Telehealth MVP is ready! Here's how to run it:

📋 OPTION 1: Using Docker (Recommended)
   1. Make sure Docker is installed and running
   2. Run: docker-compose up --build
   3. Access frontend: http://localhost:3000
   4. Access backend API: http://localhost:8000

📋 OPTION 2: Manual Setup
   A. Set up PostgreSQL:
      1. Install PostgreSQL if not already installed
      2. Create database: CREATE DATABASE telehealth;
      3. Create user with password 'password' (or update .env)
   
   B. Start Backend:
      1. cd backend
      2. Activate virtual environment:
         Windows: venv\\Scripts\\activate
         Linux/Mac: source venv/bin/activate
      3. Run: uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   C. Start Frontend (in new terminal):
      1. cd frontend
      2. Run: npm start
      3. Access: http://localhost:3000

🔐 Create Test Accounts:
   1. Go to http://localhost:3000
   2. Register as a doctor: doctor@test.com / password123
   3. Register as a patient: patient@test.com / password123

📱 Test the Application:
   1. Login as patient → Book appointment
   2. Login as doctor → View appointments → Join consultation
   3. Test video call and chat features
   4. Create prescription as doctor

📚 Documentation:
   - API docs: http://localhost:8000/docs
   - README.md: Complete setup and usage guide
   
⚠️  Important Notes:
   - Video calls require HTTPS in production
   - Change secret keys in production
   - Set up proper database credentials
   - Configure CORS for production domains
""")

def main():
    """Main setup function."""
    print_header("Telehealth MVP Setup")
    print("Welcome to the Telehealth MVP setup script!")
    print("This script will help you set up the complete application.")
    
    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Missing required tools. Please install them and run again.")
        print("\nRequired tools:")
        print("- Python 3.8+: https://python.org")
        print("- Node.js 16+: https://nodejs.org")
        sys.exit(1)
    
    # Setup backend
    backend_ok = setup_backend()
    
    # Setup frontend
    frontend_ok = setup_frontend()
    
    # Create environment files
    create_env_files()
    
    # Display results and next steps
    if backend_ok and frontend_ok:
        print_header("Setup Complete! 🎉")
        display_next_steps()
    else:
        print_header("Setup Issues Detected ⚠️")
        print("Some components failed to set up properly.")
        print("Please check the error messages above and:")
        print("1. Install missing dependencies manually")
        print("2. Check file permissions")
        print("3. Review the README.md for detailed instructions")

if __name__ == "__main__":
    main()