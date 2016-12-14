# Use the predefined node base image for this module.
FROM node:4.3

# create the log directory
RUN mkdir -p /var/log/applications/contentservice

# Creating base "src" directory where the source repo will reside in our container.
# Code is copied from the host machine to this "src" folder in the container as a last step.
RUN mkdir /src
WORKDIR /src
COPY . /src

# Install node dependencies
RUN npm install

# For development environment, we want to use forever to keep the code running
RUN npm install -g forever@0.14.2

# Map a volume for the log files and add a volume to override the code
VOLUME ["/src", "/var/log/applications/contentservice"]

# Expose web service and nodejs debug port
EXPOSE  8082
EXPOSE  5858

CMD ["forever", "-w", "--debug=5858", "local/server.js"]
