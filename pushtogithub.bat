@echo off
set GIT="%programfiles%\Git\bin\git"
%GIT% add .
%GIT% commit -m %*
%GIT% push -u origin main
