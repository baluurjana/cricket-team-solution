const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbpath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error${e.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

app.get('/players/', async (request, response) => {
  const getPlayerDetails = `
  SELECT * FROM cricket_team ORDER BY player_id ;`
  const playerArray = await db.all(getPlayerDetails)
  response.send(playerArray)
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerId, playerName, jerseyNumber, role} = playerDetails

  const addPlayerQuery = `
    Insert Into 
       cricket_team(playerId,playerName,jerseyNumber,role)
    VALUES
    (
      ${playerId},
      ${playerName},
      ${jerseyNumber},
      ${role},
      );`
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

app.get(`/players/:playerId/`, async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_Id =${playerId};`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

app.put(`/players/:playerId/`, async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
      playerName = ${playerName},
      jerseyNumber = ${jerseyNumber},
      role = ${role}
    WHERE
      player_Id = {playerId};`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete(`/players/:playerId/`, async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
    DELETE
      FROM
        cricket_team
      WHERE
        player_id = ${playerId}`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})
