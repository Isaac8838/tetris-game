# Websocket Server

    ws://localhost:8081/...

## APIs

* /lobby
* /create_room
* /join_room

### lobby
    server:                                     client:

     ----------                                  ----------
    |  client  |                                |  client  |
     ----------                                  ----------
         |                                            |
         | /lobby                                     | /lobby
         V                                            V
     ----------                                  ----------
    |  server  |                                |  server  |
     ----------                                  ----------             
         |                                            |                 
         | upgrade to websocket                       | sending JSON    
         V                                            V                 
     -----------------                           ------------           
    |  look up rooms  |<--                      |  readJSON  |<---------
     -----------------    |                      ------------           |
         |                |                           |                 |
         |                | every 5s                  |                 |
         V                |                           V                 |
     -------------        |                      ----------------       |
    |  writeJSON  |-------                      |   handle JSON  |------
     -------------                               ----------------

lobbyResponse:
```json
{
    "id": "int64",
    "room_name": "string",
    "owner": "string"
}
```

### create room
    server:                                     client:

     ----------                                  ----------
    |  client  |                                |  client  |
     ----------                                  ----------
         |                                            |
         | /create_room                               | /create_room
         V                                            V
     ----------                                  ----------
    |  server  |                                |  server  |
     ----------                                  ----------             
         |                                            |                 
         | upgrade to websocket                       | wating request #1    
         V                                            V                 
     ---------------                             ----------------
    |  readJSON #1  |                           |  writeJSON #1  |
     ---------------                             ----------------
         |                                            |
         |                                            |
         V                                            V
     ----------------                            ---------------
    |  writeJSON #2  |                          |  readJSON #2  |
     ----------------                            ---------------
         |                                            |
         | handling #2                                |
         V                                            V
     ---------------                             ---------------- 
    |  readJSON #3  |<--                        |  writeJSON #3  |<--
     ---------------    |                        ----------------    |
         |              |                             |              |
         |              |                             |              |
         V              |                             V              |
     ----------------   |                        ---------------     |
    |  writeJSON #3  |--                        |  readJSON #3  |----
     ----------------                            ---------------

#1
```json
{
    "player": "string",
    "room_name": "string"
}
```

#2
```json
{
    "room_id": "int64"
}
```

#3
```json
{
    "player": "string",
    "ready": "int8",
    "game_state": "int8",
    "data": "string"
}
```

### join room
    server:                                     client:

     ----------                                  ----------
    |  client  |                                |  client  |
     ----------                                  ----------
         |                                            |
         | /create_room                               | /create_room
         V                                            V
     ----------                                  ----------
    |  server  |                                |  server  |
     ----------                                  ----------             
         |                                            |                 
         | upgrade to websocket                       | wating request #1    
         V                                            V                 
     ---------------                             ----------------
    |  readJSON #1  |                           |  writeJSON #1  |
     ---------------                             ----------------
         |                                            |
         |                                            |
         V                                            V
     ----------------                            ---------------
    |  writeJSON #2  |                          |  readJSON #2  |
     ----------------                            ---------------
         |                                            |
         | handling #2                                |
         V                                            V
     ---------------                             ---------------- 
    |  readJSON #3  |<--                        |  writeJSON #3  |<--
     ---------------    |                        ----------------    |
         |              |                             |              |
         |              |                             |              |
         V              |                             V              |
     ----------------   |                        ---------------     |
    |  writeJSON #3  |--                        |  readJSON #3  |----
     ----------------                            ---------------

#1
```json
{
    "player": "string",
    "room_id": "int64"
}
```

#2 the value of ready will always be "OK"
```json
{
    "ready": "string"
}
```

#3 same as #3 in create room
```json
{
    "player": "string",
    "ready": "int8",
    "game_state": "int8",
    "data": "string"
}
```