DATE=`date "+%F %T"`
curl http://local.bookmarkleteer.com:5050/api/scripts \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{
        "name": "helloworld"
      , "description": "prints out \"Hello World\" to the console"
      , "raw": "console.log(\"Hello World!\")"
      }'

# curl http://localhost:5050/scripts/3
