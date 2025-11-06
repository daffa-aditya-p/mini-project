[app]
title = Modern Flappy Bird
package.name = modernflappybird
package.domain = org.daffaap

source.dir = .
source.include_exts = py,png,jpg,kv,atlas,json

version = 1.0

requirements = python3,kivy,pygame,numpy

orientation = landscape
fullscreen = 1

android.permissions = INTERNET,ACCESS_NETWORK_STATE,WRITE_EXTERNAL_STORAGE
android.api = 31
android.minapi = 21
android.ndk = 25b
android.accept_sdk_license = True

[buildozer]
log_level = 2
warn_on_root = 1
