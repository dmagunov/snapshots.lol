#!/bin/bash

# get current directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Remove all files in the directory
rm -rf "$dir"/../public/snapshots/*

# Print a message to confirm that the files have been removed
echo "All files in $dir have been removed."