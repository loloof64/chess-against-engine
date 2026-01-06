#!/bin/bash

# Extract debug symbols from already-built native libraries
echo "Extracting debug symbols from native libraries..."

mkdir -p symbols/lib

# Extract symbols for each native arch
for arch in aarch64 armv7; do
  case $arch in
    aarch64) abi="arm64-v8a" ;;
    armv7) abi="armeabi-v7a" ;;
  esac
  
  mkdir -p "symbols/lib/$abi"
  
  if [ -f "app/src/main/jniLibs/$abi/libchess_against_engine_lib.so" ]; then
    cp "app/src/main/jniLibs/$abi/libchess_against_engine_lib.so" "symbols/lib/$abi/"
    echo "Copied $abi symbols"
  else
    echo "Warning: $abi library not found at app/src/main/jniLibs/$abi/libchess_against_engine_lib.so"
  fi
done

# Create zip file with folders inside symbols/lib
if [ -d "symbols/lib/arm64-v8a" ] || [ -d "symbols/lib/armeabi-v7a" ]; then
  cd symbols/lib && zip -r ../../symbols.zip * && cd ../..
  echo "Created symbols.zip successfully"
else
  echo "Error: No libraries found to create symbols archive"
fi