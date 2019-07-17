# enabling guest user account
net user guest /active:yes

# installing chocolatey and needed software
Set-ExecutionPolicy Unrestricted
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
# probably restart of PowerShell window is needed here
choco feature enable --name=allowGlobalConfirmation --yes=true
choco install python3 nodejs git firefox 7zip sublimetext3 far gimp inkscape arduino vscode

# install manualy
# - kodu: https://www.microsoft.com/en-us/download/details.aspx?id=10056
# - stencyl: http://www.stencyl.com/download/get/win/
# - stamina: http://stamina.ru/files/StaminaSetup.exe
# - bifdefender: https://www.bitdefender.com/solutions/free/thank-you.html
# - adblock plus extension to firefox (also login as guest and install it there)
