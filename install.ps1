# Set-ExecutionPolicy Unrestricted
# 
# Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
choco feature enable --name=allowGlobalConfirmation  --yes=true
choco install jdk8 python2 nodejs git androidstudio firefox 7zip sublimetext3 far gimp inkscape

# install
# - adblock plus
# - kodu: https://www.microsoft.com/en-us/download/details.aspx?id=10056
# - stencyl: http://www.stencyl.com/download/get/win/
# - bifdefender: https://www.bitdefender.com/solutions/free/thank-you.html
# - stamina: http://stamina.ru/files/StaminaSetup.exe
#
# `npm i -g cordova ionic @angular/cli grpc`
# set ANDROID_HOME
# accept licenses `%ANDROID_HOME%\tools\bin\sdkmanager --licenses`