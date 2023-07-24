export TZ=Asia/Shanghai
export BUILD_TIME=$(date +'%Y-%m-%dT%H:%M:%S%z')


export DOCKER_DEFAULT_PLATFORM=linux/amd64
export TAG=oci.tuxm.art:8443/tusdesign/html:${VERSION}

echo ${TARGET_DEPLOYMENT}
echo $1
echo $2

REACT_APP_BASE_URL="https://api-$TARGET_DEPLOYMENT.sz9wang.com/api/v1/public"

if [ "$TARGET_DEPLOYMENT" == "prod" ]; then
    REACT_APP_BASE_URL='https://api.sz9wang.com/api/v1/public'
fi

echo ${REACT_APP_BASE_URL}

docker build  \
	-t $TAG \
    --build-arg REACT_APP_BASE_URL=${REACT_APP_BASE_URL} .

docker login oci.tuxm.art:8443 --username ${HARBOR_USER} --password ${HARBOR_PASS}
docker push $TAG
docker image rm $TAG
