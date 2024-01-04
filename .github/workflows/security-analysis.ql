name: CodeQL

on:
  push:
    branches:
      - main

jobs:
  analyze:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        language: [ 'javascript', 'python', 'java', 'php' ] # Add your language

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v1

    - name: Autobuild
      uses: github/codeql-action/autobuild@v1

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v1
      with:
        language: ${{ matrix.language }}
        query: security-analysis.ql
