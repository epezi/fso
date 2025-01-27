const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Matti Meikäläinen",
        number: "040-1234567"
    },
    {
        id: 2,
        name: "Liisa Virtanen",
        number: "050-7654321"
    },
    {
        id: 3,
        name: "Pekka Pouta",
        number: "044-9876543"
    },
    {
        id: 4,
        name: "Saara Savolainen",
        number: "045-6781234"
    },
    {
        id: 5,
        name: "Jussi Jurkka",
        number: "046-2345678"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    console.log(body)

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    } if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    } if ( persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique'
        })
    } else {
        const person = {
            "id": Math.floor(Math.random() * (1000)) + 1,
            "name": body.name,
            "number": body.number
        }
        persons = persons.concat(person)
    
        response.json(person)
    }

   
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})