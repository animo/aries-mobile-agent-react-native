#!/usr/bin/env bash

# Inputs text into the Android emulator
#
# To use:
#   - select a text input in the android emulator
#   - run this script and pass the desired text as the first argument

adb shell input text \"$1\"