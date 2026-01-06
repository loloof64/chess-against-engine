mkdir -p symbols

# Extract symbols for each native arch
for arch in aarch64 armv7; do
  case $arch in
    aarch64) abi="arm64-v8a" ;;
    armv7) abi="armeabi-v7a" ;;
  esac
  
  mkdir -p "symbols/lib/$abi"
  cp "app/src/main/jniLibs/$abi/libchess_against_engine_lib.so" "symbols/lib/$abi/"
done

# Make zip file with folders inside symbols/lib
cd symbols/lib && zip -r ../../symbols.zip * && cd ../..