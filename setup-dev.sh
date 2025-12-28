#!/usr/bin/env bash

set -e

echo "🚀 Updating system..."
sudo apt update -y
sudo apt upgrade -y

echo "🟦 Installing Python 3 and essentials..."
sudo apt install -y python3 python3-pip python3-venv python3-dev build-essential curl git wget unzip software-properties-common

# Fix node-gyp distutils issue (if Python <= 3.11)
if python3 -c "import sys; print(sys.version_info[:2])" | grep -q "(3, 11)"; then
    echo "📦 Installing python3-distutils (Python 3.11 or lower)..."
    sudo apt install -y python3-distutils
else
    echo "⚡ Python >= 3.12 detected, installing setuptools + packaging..."
    python3 -m pip install --upgrade pip setuptools packaging wheel
fi

echo "🐍 Python version:"
python3 --version
pip3 --version

echo "💡 Installing Go..."
GO_VERSION="1.22.6"
wget -q https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz
rm go${GO_VERSION}.linux-amd64.tar.gz

# Add Go to PATH
if ! grep -q "export PATH=\$PATH:/usr/local/go/bin" ~/.bashrc; then
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
fi
source ~/.bashrc

echo "🐹 Go version:"
go version

echo "🦀 Installing Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

echo "🦀 Rust version:"
rustc --version
cargo --version

echo "✅ All setup complete! Installed: Python3, Go, Rust."
