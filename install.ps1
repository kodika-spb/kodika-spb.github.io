# Set-ExecutionPolicy Unrestricted
# 
# Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
choco feature enable --name=allowGlobalConfirmation  --yes=true
choco install jdk8 python2 nodejs git androidstudio firefox 7zip sublimetext3 far

# install
# - adblock plus
# - kodu: https://www.microsoft.com/en-us/download/details.aspx?id=10056
# - stencyl: http://www.stencyl.com/download/get/win/
# - bifdefender: https://www.bitdefender.com/solutions/free/thank-you.html
# 
# http://www.microsoft.com/downloads/details.aspx?familyid=95b251b6-a61d-41b3-b1ec-e7602ab2b48b
# 0B7N-20MU-Y1RM-PY92-K5YM
#
# `npm i -g cordova ionic @angular/cli grpc`
# set ANDROID_HOME
# accept licenses `%ANDROID_HOME%\tools\bin\sdkmanager --licenses`
# enable virtualization (VT) in bios
# install Hyper-V from Windows features
# `bcdedit /set hypervisorlaunchtype auto`