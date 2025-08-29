#!/bin/bash
cd /home/kavia/workspace/code-generation/e-commerce-platform-13535-13544/e_commerce_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

