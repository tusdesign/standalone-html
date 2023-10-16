export TZ=Asia/Shanghai
export BUILD_TIME=$(date +'%Y-%m-%dT%H:%M:%S%z')

export DOCKER_DEFAULT_PLATFORM=linux/amd64
export TAG=registry.sz9wang.com/tusdesign/html:${TARGET_DEPLOYMENT}

REACT_APP_BASE_URL="https://api-$TARGET_DEPLOYMENT.sz9wang.com/api/v1/public"
VITE_BASE_URL="https://api-$TARGET_DEPLOYMENT.sz9wang.com/api/v1/public"

if [ "$TARGET_DEPLOYMENT" = "prod" ]; then
  REACT_APP_BASE_URL='https://api.sz9wang.com/api/v1/public'
  VITE_BASE_URL='https://api.sz9wang.com/api/v1/public'
fi

echo ${REACT_APP_BASE_URL}
echo ${VITE_BASE_URL}

docker build \
  -t $TAG \
  --build-arg REACT_APP_BASE_URL=${REACT_APP_BASE_URL} \
  --build-arg VITE_BASE_URL=${VITE_BASE_URL} \
  .

docker registry.sz9wang.com --username ${HARBOR_USER} --password ${HARBOR_PASS}
docker push $TAG
docker image rm $TAG
