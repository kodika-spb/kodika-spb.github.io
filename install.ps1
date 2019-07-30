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

# uninstall OneDrive manually

# installing chocolatey: https://chocolatey.org/install#installing-chocolatey
Set-ExecutionPolicy Bypass -Scope Process
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
choco feature enable --name=allowGlobalConfirmation --yes=true

# installing software with chocolatey
choco install nodejs git firefox 7zip sublimetext3 far gimp inkscape vscode teamviewer urbackup-client blender

# on hp01 laptop run `choco install urbackup-server` and in urbackup-server UI:
# - configure folder to store backups - point it to external HDD root https://www.urbackup.org/administration_manual.html#x1-40002.1
# - disable all scheduled backups:
#   - https://www.urbackup.org/administration_manual.html#x1-720008.5.3
#   - https://www.urbackup.org/administration_manual.html#x1-720008.5.4

# install manualy (download to USB stick and install from there)
# - kodu: https://www.microsoft.com/en-us/download/details.aspx?id=10056
# - stencyl: http://www.stencyl.com/download/get/win/
# - stamina: http://stamina.ru/files/StaminaSetup.exe
# - arduino: https://www.microsoft.com/ru-ru/p/arduino-ide/9nblggh4rsd8?ocid=badge&rtc=1&activetab=pivot:overviewtab
# - bifdefender: https://www.bitdefender.com/solutions/free/thank-you.html
#   and register it for free use
# - adblock plus extension to firefox (also login as guest and install it there)

# extra configuration:
# - name computer like: hp01, lenovo01, sony01 etc
# - in Control panel check for updates
# - make firefox default browser for admin and guest
# - for guest account remove useless links from start menu (from right panel)

# make full image backup of the laptop with UrBackup Server UI

# following lines are optional
# prepearing device for Windows Admin Center
# read doc first: https://www.tenforums.com/tutorials/113966-windows-admin-center-centrally-manage-all-your-windows-10-pcs.html
Set-Service WinRM -StartupType Automatic
Start-Service WinRM
Set-Item WSMan:\localhost\Client\TrustedHosts -Value 'hp01'
REG ADD HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1
Set-NetFirewallRule -Name WINRM-HTTP-In-TCP -RemoteAddress Any

# on hp01 laptop download and install: https://aka.ms/WACDownload
