FROM php:8.2-apache

# Instalar extensiones necesarias para MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Instalar herramientas útiles (puedes quitar nano/vim en producción)
RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# Evitar warning de ServerName
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configuración de Apache
RUN echo '<Directory /var/www/html/>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/allow.conf \
    && a2enconf allow

# Página de inicio
RUN echo '<IfModule dir_module>\n\
    DirectoryIndex index.php index.html\n\
</IfModule>' > /etc/apache2/conf-available/index.conf \
    && a2enconf index

# Alias para exponer el backend en /api
RUN echo 'Alias /api /var/www/src\n\
<Directory /var/www/src>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/api.conf \
    && a2enconf api

# Copiar tu código fuente (ajustado para Kubernetes)
COPY public/ /var/www/html/
COPY src/ /var/www/src/

# Permisos correctos
RUN chown -R www-data:www-data /var/www/html /var/www/src \
    && chmod -R 755 /var/www/html /var/www/src

# Puerto expuesto en K8s
EXPOSE 80

# Iniciar Apache en foreground
CMD ["apache2-foreground"]
