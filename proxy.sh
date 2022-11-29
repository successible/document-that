echo 'What is your ngrok subdomain? Example: https://1bd6-73-75-45-179.ngrok.io'
read DOMAIN
export CLIENT_DOMAIN=$DOMAIN
export NEXT_PUBLIC_SERVER_DOMAIN=$DOMAIN

abspath() {                                               
    cd "$(dirname "$1")"
    printf "%s/%s\n" "$(pwd)" "$(basename "$1")"
    cd "$OLDPWD"
}

mkcert localhost
sudo pkill -9 -f "nginx"
sudo nginx -c $(abspath "nginx.conf") &

pnpm run dev