#!/bin/bash

DATE=`date '+%Y%m%d%H%M%S'`$RANDOM

cd ../Senior_Project/android && ./gradlew assembleRelease
mv ./app/build/outputs/apk/app-release.apk ../../manage_API/app/android_app/$DATE.apk

cd ../ios && cp -R Application.xcodeproj/ ../../manage_API/app/ios_app/Application.xcodeproj
cd ../../manage_API/app/ios_app && zip -r $DATE.zip Application.xcodeproj/
rm -rf ./Application.xcodeproj
#please bring date last line
echo $DATE