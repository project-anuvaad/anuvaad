FROM openjdk:11-jdk-slim
#COPY / /app
#WORKDIR /app
ADD target/anuvaad-zuul-0.0.1-SNAPSHOT.jar zuul.jar
RUN mvn -B -f pom.xml package
ENTRYPOINT ["java", "-jar", "/zuul.jar"]
