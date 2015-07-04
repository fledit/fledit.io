run:
	grunt serve

build:
	grunt build

production:
	cp dist/.env .env.backup 2>/dev/null || :
	grunt build:production
	mv .env.backup dist/.env 2>/dev/null || :

deploy: build
	grunt buildcontrol:heroku

packages:
	npm install
	bower install

install: packages

prune:
	npm prune

update: prune packages production
