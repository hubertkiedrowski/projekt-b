ARG DENO_VERSION=1.42.3
ARG DENO_VERSION=1.42.3

# Stage 1: Install Deno
FROM denoland/deno:$DENO_VERSION AS deno_installer
RUN deno --version

# Stage 2: Final image
FROM ubuntu

# Kopieren Sie Deno aus dem vorherigen Stadium
COPY --from=deno_installer /deno /usr/local/bin/deno

# Fügen Sie den Deno-Pfad zur Umgebungsvariable hinzu
ENV DENO_INSTALL="/usr/local/bin/deno"

# Führen Sie den Befehl aus, um die Typdefinitionen für Deno zu installieren
RUN deno install --allow-read --allow-write https://deno.land/x/deno_types/gen.d.ts

# Setzen Sie den Pfad für Deno in der Umgebungsvariable
ENV PATH=$DENO_INSTALL:$PATH

# Setzen Sie das Arbeitsverzeichnis für Ihre App
WORKDIR /app

# Kopieren Sie Ihre Anwendungsdateien in das Arbeitsverzeichnis
COPY . .

