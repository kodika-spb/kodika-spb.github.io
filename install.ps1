# Set-ExecutionPolicy Unrestricted
# 
# Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
choco feature enable --name=allowGlobalConfirmation  --yes=true
choco install python2
choco install nodejs
choco install git
choco install androidstudio
choco install firefox
choco install 7zip
choco install sublimetext3
choco install far

# npm i -g cordova ionic @angular/cli