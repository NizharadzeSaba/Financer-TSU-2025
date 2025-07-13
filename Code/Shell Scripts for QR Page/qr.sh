#!/bin/bash

read -p "Enter the QR code link: " qr_link

if [ -z "$qr_link" ]; then
  echo "No input provided. Exiting."
  exit 1
fi

output_path="/root/FinancerTsuProject/static-webpage-for-qr/qr.png"

qrencode -o "$output_path" "$qr_link"

if [ $? -eq 0 ]; then
  echo "✅ QR code generated at: $output_path"
else
  echo "❌ Failed to generate QR code."
fi
