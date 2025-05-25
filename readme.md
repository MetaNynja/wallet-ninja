# Wallet Ninja

A secure, offline-capable desktop application by MetaNynja to generate custom XRP Ledger (XRPL) wallet addresses with user-specified prefixes. Built with Electron, Wallet Ninja offers a user-friendly interface for Windows and macOS, ensuring fast and secure wallet generation.

## Features
Wallet Ninja provides the following capabilities:
- **Generate Custom XRPL Addresses**: Create XRP Ledger wallet addresses that start with user-defined prefixes (e.g., `rJoeyWallet`, `rFirstLedger`, `rNynja`).
- **Case-Insensitive Prefix Search**: Match prefixes regardless of case (e.g., `rNynja` matches `rnynja` or `RNYNJA`).
- **Multi-Threaded Processing**: Utilize multiple CPU workers (from 1 to the number of available CPU cores minus one) to generate addresses in parallel, speeding up the search for matching prefixes.
- **Flexible Prefix Input**: Enter multiple comma-separated prefixes to search for multiple custom addresses in a single session.
- **Automatic Validation**: Validate prefixes to ensure they start with 'r' and contain only alphanumeric characters, with clear error messages for invalid inputs.
- **Progress Tracking**: Display real-time progress with a counter of total wallets generated and a progress bar for visual feedback.
- **Results Display**: Show generated wallets (address, seed, and matched prefix) in a table within the GUI for easy viewing.
- **Automatic File Saving**: Save all generated wallets to `wallets.txt` in the app’s directory, including address, seed, prefix, and timestamp, ensuring no results are lost.
- **Manual File Saving**: Use the "Save Results" button to save wallets to a user-specified location via a file dialog, with confirmation alerts for successful saves.
- **Offline Operation**: Run entirely offline to maximize security, with no internet dependencies, protecting sensitive seeds and private keys.
- **User-Friendly Interface**: Offer an intuitive GUI with:
  - Input fields for prefixes and worker count.
  - Start, Stop, and Save buttons for controlling the generation process.
  - A checkbox to confirm offline operation for security awareness.
  - Help text explaining prefix rules, case-insensitive searches, and that shorter prefixes are found faster, while longer ones may take longer.
- **Cross-Platform Support**: Available as executables for Windows (`.exe`) and macOS (`.dmg`), built with Electron for consistent performance.
- **Secure Design**: Implement Electron’s context isolation and disabled node integration to prevent security vulnerabilities in the renderer process.
- **Error Handling**: Provide alerts for errors (e.g., invalid prefixes, worker failures) to guide users effectively.
- **Accessibility**: Include high-contrast text, keyboard navigation, and ARIA labels for better accessibility in the GUI.

## Download
- **Windows**: [Download v1.0.0](https://github.com/yourusername/wallet-ninja/releases/download/v1.0.0/wallet-ninja.exe)
  - SHA256: [your-checksum]
- **macOS**: [Download v1.0.0](https://github.com/yourusername/wallet-ninja/releases/download/v1.0.0/wallet-ninja.dmg)
  - SHA256: [4e164613e9999eea49d00c5d89fd69744dfe90c6bc658c8cf5c94cfb43d6bec3]

## How to Use
1. **Download**: Get the appropriate executable for your platform from the GitHub Releases page.
2. **Verify Checksum**: Confirm the file’s integrity using the provided SHA256 checksum.
   - Windows: `certutil -hashfile wallet-ninja.exe SHA256`
   - macOS/Linux: `sha256sum wallet-ninja.dmg`
3. **Disconnect from the Internet**: Ensure you are offline to protect your keys.
4. **Run the App**: Launch the executable.
5. **Enter Prefixes**: Input comma-separated prefixes (e.g., `rJoeyWallet,rFirstLedger,rNynja`). Prefix searches are case-insensitive (e.g., `rNynja` matches `rnynja`). Shorter prefixes are generally found faster; longer prefixes may take longer.
6. **Select Workers**: Choose the number of CPU workers (1 to max available cores) to balance speed and CPU usage.
7. **Generate**: Click "Start Generating" to begin searching for matching addresses. Check the offline checkbox to confirm you’re offline.
8. **Monitor Progress**: Watch the counter and progress bar to track generation.
9. **View Results**: See generated wallets in the results table, including address, seed, and prefix.
10. **Save Results**: Click "Save Results" to choose a location for `wallets.txt`, or find it automatically saved in the app’s directory.
11. **Secure Storage**: Store `wallets.txt` on an encrypted device to protect your seeds.

## Security Warning
- **Run Offline**: Always disconnect from the internet before running to prevent key leakage.
- **Secure Seeds**: Never share your seed or private key. Store `wallets.txt` in a safe, encrypted location.
- **Verify Downloads**: Use the provided checksums to ensure the app is authentic.

## Building from Source
1. Clone the repository: `git clone https://github.com/yourusername/wallet-ninja.git`
2. Install dependencies: `npm install`
3. Run locally: `npm start`
4. Build executables: `npm run dist`

## License
MIT License

## Author
MetaNynja
