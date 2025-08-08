EVENT=events/example.json
ENVIRON=events/environment.json

default: build

build: build-in-the-loop-lambda

build-in-the-loop-lambda:
	go build -o .out/in-the-loop-lambda cmd/in-the-loop-lambda/main.go

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
	sam local invoke InTheLoopLambda --event $(EVENT) --env-vars $(ENVIRON)

serve-local: sam
	ENV=local sam local start-lambda --env-vars $(ENVIRON)

deploy: sam
	sam deploy --guided
