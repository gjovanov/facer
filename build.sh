set -ex
# SET THE FOLLOWING VARIABLES
USERNAME=gjovanov
IMAGE=facer
docker build -t $USERNAME/$IMAGE:latest .
