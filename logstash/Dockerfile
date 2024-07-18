FROM docker.elastic.co/logstash/logstash:7.14.1

# Install the logstash-output-jdbc plugin
RUN logstash-plugin install logstash-output-jdbc

# Download the PostgreSQL JDBC driver
RUN curl -L -o /usr/share/logstash/logstash-core/lib/jars/postgresql.jar https://jdbc.postgresql.org/download/postgresql-42.2.23.jar

# Copy Logstash configuration files
COPY config/logstash.yml /usr/share/logstash/config/logstash.yml
COPY pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.conf
