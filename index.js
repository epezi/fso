
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body',(request) => {
    return Object.keys(request.body).length > 0 ? JSON.stringify(request.body) : ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
  })

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons',(request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    } if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })

    } else {
        const person = new Person ({
            "name": body.name,
            "number": body.number
        })
        person.save().then(result => {
              console.log(`added ${person.name} number ${person.number} to phonebook`)
              response.json(person)
        })
    }

   
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})