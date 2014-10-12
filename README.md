# cocos2d-js环境配置（ubuntu14.04）
参考：    https://github.com/cocos2d/cocos2d-js

下载官网版压缩包：  
    $ wget http://www.cocos2d-x.org/filedown/cocos2d-js-v3.0.zip  
或者下载github版本：  
    $ git clone git@github.com:cocos2d/cocos2d-js.git

## Github note

If you fork our github repository or download the package from github, you will need to do some extra tasks:

- Run `git submodule update --init --recursive` in the `cocos2d-js` root folder, to init and update submodules recursively, such as `cocos2dx/plugin`.
- Run `frameworks/js-bindings/cocos2d-x/download-deps.py` to download external dependencies for Cocos2d-x
- Run `tools/cocos2d-console/download-bin.py` to download bin files for some cocos2d-console plugins like Google Closure Compiler and JSC Compiler.

Otherwise, you will fail to compile your JSB projects.

## Ubuntu 14.04_64bit

- 下载JDK：  
    $ wget http://download.oracle.com/otn-pub/java/jdk/7u67-b01/jdk-7u67-linux-x64.tar.gz  
    官网地址：http://www.oracle.com/technetwork/java/javase/downloads/index.html
- 下载ADT（eclipse && sdk）：  
    $ wget https://dl.google.com/android/adt/adt-bundle-linux-x86_64-20140702.zip  
    官网地址：https://developer.android.com/sdk/installing/index.html
- 下载NDK：  
    $ wget http://dl.google.com/android/ndk/android-ndk-r9d-linux-x86_64.tar.bz2  
    ndk 历史版本(10以下)下载链接格式：http://dl.google.com/android/ndk/android-ndk-version-platform-x86(_64).tar.bz2  
    官网地址：https://developer.android.com/tools/sdk/ndk/index.html#Revisions
- 下载ANT：  
    $ wget http://mirrors.cnnic.cn/apache//ant/binaries/apache-ant-1.9.4-bin.tar.bz2  
    官网地址：http://ant.apache.org/bindownload.cgi

## Notice

For JSB build, there are some restrictions

- [Android build] NDK version must be r9d
- [iOS build] Xcode version must be 5.1.1 +
- ubuntu14.04 32bit support  
    $ sudo apt-get install lib32stdc++6 lib32z1 lib32z1-de
