const Joi = require('joi')
const express = require('express')
const app = express()
const matches = require('./matches.json')
const teams = require('./teams.json')

app.use(express.json())

app.post('https://psl.herokuapp.com/matches', (req, res) => {
    const {
        error
    } = validateMatches(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const match = {
        id: matches.length + 1,
        city: req.body.city,
        date: req.body.date,
        teamA: req.body.teamA,
        teamB: req.body.teamB
    }

    matches.push(match)
    res.send(match)
})
app.get('https://psl.herokuapp.com/teams', (req, res) => {
    res.send(teams)
})

app.get('https://psl.herokuapp.com/teams/:id', (req, res) => {
    const team = teams.find(c => c.id === parseInt(req.params.id))

    if (!team) {
        return res.status(404).send('The team is not found :(')
    } else {
        res.send(team)
    }
})

function validateMatches(match) {
    const schema = Joi.object({
        city: Joi.string().min(5).required(),
        date: Joi.date().min(5).required(),
        teamA: Joi.string().min(6).required(),
        teamB: Joi.string().min(6).required()
    })
    return schema.validate(match)
}
app.get('https://psl.herokuapp.com/matches', (req, res) => {
    res.send(matches)
})

app.get('https://psl.herokuapp.com/matches/:id', (req, res) => {
    const match = matches.find(c => c.id === parseInt(req.params.id))

    if (!match) {
        return res.status(404).send('The match is not found :(')
    } else {
        res.send(match)
    }
})

app.put('https://psl.herokuapp.com/matches/:id', (req, res) => {
    const match = matches.find(c => c.id === parseInt(req.params.id))
    if (!match) {
        return res.status(404).send('The Match is not found :(')
    }

    const {
        error
    } = validateMatches(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    match.city = req.body.city
    match.date = req.body.date
    match.teamA = req.body.teamA
    match.teamB = req.body.teamB

    res.send(match)
})

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`listening on port ${port}...`))