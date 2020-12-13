#!/bin/zsh
include -q functions
include -q network
include -lq file
include -lq debug
integer isProd

prodHost='api.idiomusapp.com'
url=$(grep  'apiBaseUrl' config.js | explode --stdin "'" 2)
[[ $prodHost == "$(urlinfo -h $url)" ]] && isProd=1
#set -x
((isProd)) && {
	techo -c lred "Production API: $url"
	confirm 'Start anyway' || return 0
}
techo -n "url: \"$url\""

integer ap2Pid error dbPid
{
	out=$(systemctl status --no-pager -q mysql.service) || {
		techo -c lred "DB not running: \n$out"
		return 1
	}
} & dbPid=$!

{
	out=$(systemctl status --no-pager -q nginx.service) || {
		techo -c lred "Web server not running: ($ret):\n$out"
		return 1
	}
} & ap2Pid=$!
set -x
wait $dbPid || {
	{ ((isProd)) || confirm 'Start mysql' } && {
		techo -c warn "Starting mysql"
		sudo systemctl start mysql
	} || techo -c warn "Mysql is $C[lred]OFF"
}
wait $ap2Pid || {
	{ ((!isProd)) || confirm 'Start apache' } && {
		techo -c warn "Starting nginx"
		sudo systemctl start nginx
	} || techo -c warn "nginx is $C[lred]OFF"
}

ip addr | grep 192
true
