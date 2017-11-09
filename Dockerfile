FROM abiosoft/caddy

LABEL auther="Raincal <cyj94228@gmail.com>"

ADD public /srv

ADD Caddyfile /etc

EXPOSE 2015
