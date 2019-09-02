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
choco install nodejs git firefox 7zip sublimetext3 far gimp inkscape vscode teamviewer urbackup-client blender arduino veyon

# on hp01 laptop run `choco install urbackup-server` and in urbackup-server UI:
# - configure folder to store backups - point it to external HDD root https://www.urbackup.org/administration_manual.html#x1-40002.1
# - disable all scheduled backups:
#   - https://www.urbackup.org/administration_manual.html#x1-720008.5.3
#   - https://www.urbackup.org/administration_manual.html#x1-720008.5.4

# install manualy (download to USB stick and install from there)
# - kodu: https://www.microsoft.com/en-us/download/details.aspx?id=10056
# - stencyl: http://www.stencyl.com/download/get/win/
# - stamina: http://stamina.ru/files/StaminaSetup.exe
# - scratch for arduino: http://s4a.cat/
# - bifdefender: https://www.bitdefender.com/solutions/free/thank-you.html
#   and register it for free use
# - adblock plus extension to firefox (also login as guest and install it there)

# extra configuration:
# - name computer like: hp01, lenovo01, sony01 etc
# - in Control panel check for updates
# - make firefox default browser for admin and guest

# make full image backup of the laptop with UrBackup Server UI
