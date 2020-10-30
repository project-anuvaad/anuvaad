FROM openjdk:11-jdk-slim
COPY / /app
WORKDIR /app
ADD anuvaad-zuul*.jar zuul.jar
RUN mvn -B -f pom.xml package
ENTRYPOINT ["java", "-jar", "/zuul.jar"]
