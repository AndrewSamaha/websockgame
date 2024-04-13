# Websocket TD
## Sprint Goals:
1. Connect UI to websockrelay and console out messages
1. Send create-unit request to server on user create
1. Send create-unit responses from the server once every 5 seconds where a unit contains:
  1. position
  1. vector (with velocity)
  1. these units will only move in a stright line
1. Maintain state on server