# Name of Docker Compose services
COMPOSE=docker compose
PHP_SERVICE=php
COMPOSER_SERVICE=composer_sf

# Environment variables
ENV_FILE=.env

# Docker Compose commands
build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart: down up

logs:
	$(COMPOSE) logs -f

# Accessing containers
php-sh:
	$(COMPOSE) exec $(PHP_SERVICE) sh

composer-sh:
	$(COMPOSE) exec $(COMPOSER_SERVICE) sh

# Composer commands
composer-install:
	$(COMPOSE) exec $(COMPOSER_SERVICE) composer install

composer-require:
	$(COMPOSE) exec $(COMPOSER_SERVICE) composer require $(package)

# Symfony commands
make-entity:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console make:entity $(entity)

make-migration:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console make:migration

migrate:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console doctrine:migrations:migrate --no-interaction

cache-clear:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console cache:clear

# Doctrine commands
create-database:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console doctrine:database:create --if-not-exists

drop-database:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console doctrine:database:drop --force

create-schema:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console doctrine:schema:create

update-schema:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console doctrine:schema:update --force

validate-schema:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console doctrine:schema:validate

fixtures:
	$(COMPOSE) exec $(COMPOSER_SERVICE) php bin/console doctrine:fixtures:load --no-interaction

# Use:
# make build - build containers
# make up - start containers
# make down - stop containers
# make restart - restart containers
# make logs - display container logs
# make php-sh - access the PHP container shell
# make composer-sh - access the Composer container shell
# make composer-install - install Composer dependencies
# make composer-require package=vendor/package - add a Composer package
# make make-entity entity=User - create a Symfony entity
# make make-migration - create a migration
# make migrate - execute migrations
# make cache-clear - empty the Symfony cache
# make create-database - create the database
# make drop-database - drop the database
# make create-schema - create the database schema
# make update-schema - update the database schema
# make validate-schema - validate the database schema
# make fixtures - load fixtures into the database