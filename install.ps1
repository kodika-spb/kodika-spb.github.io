# IMPORTANT! right click on PowerShell and select "Run As Administrator"

# enabling guest user account
net user guest /active:yes

# installing chocolatey and needed software
Set-ExecutionPolicy Unrestricted
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
# probably restart of PowerShell window is needed here
choco feature enable --name=allowGlobalConfirmation --yes=true
choco install python3 nodejs git firefox 7zip sublimetext3 far gimp inkscape arduino vscode teamviewer urbackup-client
# on HP1 laptop also run `choco install urbackup-server`

# install manualy (download to USB stick and install from there)
# - kodu: https://www.microsoft.com/en-us/download/details.aspx?id=10056
# - stencyl: http://www.stencyl.com/download/get/win/
# - stamina: http://stamina.ru/files/StaminaSetup.exe
# - bifdefender: https://www.bitdefender.com/solutions/free/thank-you.html
# - register bifdefender for free use
# - adblock plus extension to firefox (also login as guest and install it there)

# prepearing device for Windows Admin Center
# read doc first: https://www.tenforums.com/tutorials/113966-windows-admin-center-centrally-manage-all-your-windows-10-pcs.html
Set-Service WinRM -StartupType Automatic
Set-Item WSMan:\localhost\Client\TrustedHosts -Value 'HP1'
REG ADD HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1
Set-NetFirewallRule -Name WINRM-HTTP-In-TCP -RemoteAddress Any
# - on HP1 laptop download and install: https://aka.ms/WACDownload
