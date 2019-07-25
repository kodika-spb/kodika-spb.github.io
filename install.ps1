# IMPORTANT! right click on PowerShell and select "Run As Administrator"

# creating guest user account
net user guest /add /active:yes
# when asking for password just press Enter to leave password empty
net user guest *

# uninstall built in apps
Set-ExecutionPolicy Bypass -Scope Process
get-appxpackage *alarms* | remove-appxpackage
get-appxpackage *communicationsapps* | remove-appxpackage
get-appxpackage *feedback* | remove-appxpackage
get-appxpackage *getstarted* | remove-appxpackage
get-appxpackage *skypeapp* | remove-appxpackage
get-appxpackage *zune* | remove-appxpackage
get-appxpackage *maps* | remove-appxpackage
get-appxpackage *messaging* | remove-appxpackage
get-appxpackage *solitaire* | remove-appxpackage
get-appxpackage *wallet* | remove-appxpackage
get-appxpackage *bing* | remove-appxpackage
get-appxpackage *onenote* | remove-appxpackage
get-appxpackage *people* | remove-appxpackage
get-appxpackage *phone* | remove-appxpackage
get-appxpackage *sticky* | remove-appxpackage
get-appxpackage *xbox* | remove-appxpackage

# installing chocolatey and needed software
Set-ExecutionPolicy Bypass -Scope Process
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
# probably restart of PowerShell window is needed here
choco feature enable --name=allowGlobalConfirmation --yes=true
choco install nodejs git firefox 7zip sublimetext3 far gimp inkscape vscode teamviewer urbackup-client blender
# on HP1 laptop also run `choco install urbackup-server`

# install manualy (download to USB stick and install from there)
# - kodu: https://www.microsoft.com/en-us/download/details.aspx?id=10056
# - stencyl: http://www.stencyl.com/download/get/win/
# - stamina: http://stamina.ru/files/StaminaSetup.exe
# - arduino: https://www.microsoft.com/ru-ru/p/arduino-ide/9nblggh4rsd8?ocid=badge&rtc=1&activetab=pivot:overviewtab
# - bifdefender: https://www.bitdefender.com/solutions/free/thank-you.html
# - register bifdefender for free use
# - adblock plus extension to firefox (also login as guest and install it there)

# prepearing device for Windows Admin Center
# read doc first: https://www.tenforums.com/tutorials/113966-windows-admin-center-centrally-manage-all-your-windows-10-pcs.html
Set-Service WinRM -StartupType Automatic
Start-Service WinRM
Set-Item WSMan:\localhost\Client\TrustedHosts -Value 'HP1'
REG ADD HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1
Set-NetFirewallRule -Name WINRM-HTTP-In-TCP -RemoteAddress Any
# - on HP1 laptop download and install: https://aka.ms/WACDownload
