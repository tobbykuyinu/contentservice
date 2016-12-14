# Use the predefined node base image for this module.
FROM node:5.11.1

# create the log directory
RUN mkdir -p /var/log/applications/stockrequestservice

# Creating base "src" directory where the source repo will reside in our container.
# Code is copied from the host machine to this "src" folder in the container as a last step.
RUN mkdir /src
WORKDIR /src
COPY . /src

# Tell npm to use our registry
RUN npm set registry http://npm.igbimo.com:4873

# Install node dependencies
RUN npm install

# Specific installations required by bamboo and test automation - hence not included in npm install above.
RUN npm install jshint-junit-reporter mocha-bamboo-reporter

# For development environment, we want to use forever to keep the code running
RUN npm install -g forever@0.14.2

# Map a volume for the log files and add a volume to override the code
VOLUME ["/src", "/var/log/applications/stockrequestservice"]

# Expose web service and nodejs debug port
EXPOSE  8080
EXPOSE  5858

CMD ["forever", "-w", "--debug=5858", "server.js"]
