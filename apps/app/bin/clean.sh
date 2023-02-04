#!/bin/bash

# Set the directory path
dir="/Users/dmagunov/vservers/nft/playground-nextjs/apps/app/public/snapshots"

# Remove all files in the directory
rm -rf "$dir"/*

# Print a message to confirm that the files have been removed
echo "All files in $dir have been removed."