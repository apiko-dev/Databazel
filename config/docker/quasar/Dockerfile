FROM openjdk:8-jre

WORKDIR /home/quasar

RUN wget https://github.com/quasar-analytics/quasar/releases/download/v11.3.6-quasar-web/quasar-web_2.11-11.3.6-one-jar.jar

ARG quasar_settings

RUN echo $quasar_settings > quasar-config.json

EXPOSE 20223

ENTRYPOINT ["java", "-jar", "quasar-web_2.11-11.3.6-one-jar.jar", "-c", "quasar-config.json"]
