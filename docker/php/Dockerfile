FROM php:8.2-fpm

# Installer Composer
COPY --from=composer:2.5.8 /usr/bin/composer /usr/bin/composer

# Mise à jour et installation des dépendances nécessaires
RUN apt-get update && apt-get install -y \
    vim \
    postgresql-client \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY . .

# Donner les droits nécessaires
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html