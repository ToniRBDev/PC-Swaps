# ============================================================
# Etapa 1: compilar el JAR dentro de Docker
# ============================================================
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Copiamos primero solo los ficheros de dependencias para aprovechar la caché de Docker.
# Si el código cambia pero el pom.xml no, Docker reutiliza la capa de dependencias.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copiamos el código fuente y compilamos saltándonos los tests
COPY src ./src
RUN ./mvnw clean package -DskipTests


# ============================================================
# Etapa 2: imagen final solo con el JRE y el JAR compilado
# ============================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Creamos la carpeta de uploads para las imágenes subidas por los usuarios
RUN mkdir -p /app/uploads

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
