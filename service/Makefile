EVENT=events/example.json
ENVIRON=events/environment.json

default: build

build: build-el-track-lambda

build-el-track-lambda:
	go build -o .out/el-track-lambda cmd/el-track-lambda/main.go

test:
	go test ./... -cover

test-report:
	go test -v -coverprofile ".out/cover.out" ./...
	go tool cover -html ".out/cover.out" -o ".out/cover.html"
	start ".out/cover.html"

clean:
	go clean
	go clean -testcache

sam: build
	sam build

invoke: sam
	sam local invoke ElTrackLambda --event $(EVENT) --env-vars $(ENVIRON)

serve-local: sam
	ENV=local sam local start-lambda --env-vars $(ENVIRON)

deploy: sam
	sam deploy --guided
