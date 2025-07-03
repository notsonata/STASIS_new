@echo off
setlocal enabledelayedexpansion

REM STASIS Docker Build and Deploy Script for Windows
REM This script builds the Docker image and optionally runs it locally

echo 🚀 Starting STASIS Docker build process...

REM Default values
set BUILD_ONLY=false
set RUN_LOCAL=false
set IMAGE_NAME=stasis-webapp
set TAG=latest

REM Parse command line arguments
:parse_args
if "%~1"=="" goto end_parse
if "%~1"=="--build-only" (
    set BUILD_ONLY=true
    shift
    goto parse_args
)
if "%~1"=="--run" (
    set RUN_LOCAL=true
    shift
    goto parse_args
)
if "%~1"=="--tag" (
    set TAG=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="--help" (
    echo Usage: %0 [OPTIONS]
    echo Options:
    echo   --build-only    Only build the Docker image
    echo   --run           Build and run locally
    echo   --tag TAG       Specify image tag ^(default: latest^)
    echo   --help          Show this help message
    exit /b 0
)
echo Unknown option: %~1
echo Use --help for usage information
exit /b 1

:end_parse

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker is not running. Please start Docker and try again.
    exit /b 1
)

echo ✓ Docker is running

REM Check if we're in the correct directory
if not exist "Dockerfile" (
    echo ✗ Dockerfile not found. Please run this script from the STASIS project root directory
    exit /b 1
)
if not exist "pom.xml" (
    echo ✗ pom.xml not found. Please run this script from the STASIS project root directory
    exit /b 1
)
if not exist "frontend" (
    echo ✗ frontend directory not found. Please run this script from the STASIS project root directory
    exit /b 1
)

echo ✓ Found project files

REM Build the Docker image
echo.
echo 🏗️  Building Docker image...
echo    Image: %IMAGE_NAME%:%TAG%

docker build -t "%IMAGE_NAME%:%TAG%" .
if errorlevel 1 (
    echo ✗ Docker build failed
    exit /b 1
)

echo ✓ Docker image built successfully

REM Tag as latest if not already
if not "%TAG%"=="latest" (
    docker tag "%IMAGE_NAME%:%TAG%" "%IMAGE_NAME%:latest"
    echo ✓ Tagged image as latest
)

if "%BUILD_ONLY%"=="true" (
    echo.
    echo ✓ Build complete! Use the following commands to run:
    echo    Local: docker run -p 8080:8080 %IMAGE_NAME%:%TAG%
    echo    Compose: docker-compose up
    exit /b 0
)

if "%RUN_LOCAL%"=="true" (
    echo.
    echo 🐳 Starting local container...
    
    REM Stop any existing container
    for /f "tokens=*" %%i in ('docker ps -q -f name=stasis-local 2^>nul') do (
        echo ⚠ Stopping existing container...
        docker stop stasis-local >nul 2>&1
        docker rm stasis-local >nul 2>&1
    )
    
    REM Run the container
    docker run -d --name stasis-local -p 8080:8080 -e SPRING_PROFILES_ACTIVE=docker -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/stasis -e SPRING_DATASOURCE_USERNAME=postgres -e SPRING_DATASOURCE_PASSWORD=123 "%IMAGE_NAME%:%TAG%"
    
    if errorlevel 1 (
        echo ✗ Failed to start container
        exit /b 1
    )
    
    echo ✓ Container started successfully
    echo.
    echo 📱 Application URLs:
    echo    Frontend: http://localhost:8080
    echo    API: http://localhost:8080/api
    echo    Health: http://localhost:8080/actuator/health
    echo.
    echo 📋 Container commands:
    echo    Logs: docker logs -f stasis-local
    echo    Stop: docker stop stasis-local
    echo    Remove: docker rm stasis-local
)

echo.
echo ✓ Script completed successfully! 🎉

endlocal
