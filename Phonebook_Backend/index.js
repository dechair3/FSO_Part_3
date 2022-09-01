const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))


morgan.token('body', (req, res) => { 
    if(req.method === 'POST'){
       return JSON.stringify(req.body)
    }
    return null
})
app.use(morgan(':body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Test", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date
    const today = date.toString()
    response.send(`
    <div>
      <p>Phonebook currently has ${persons.length} people in it</p>
    </div>
    <div>
      <p> ${today}  </p>
    </div>
    `)
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

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name is missing' 
      })
    }
    if(!body.number) {
        return response.status(400).json({ 
          error: 'Number is missing' 
        })
    }
    const person = {
        id: Math.floor(Math.random() * 999999999),
        name: body.name,
        number: body.number
    }
    
    if(persons.some(people => people.name === person.name)){
        return response.status(400).json({ 
            error: 'Name must be unique' 
          })
    }

    persons = persons.concat(person)
    
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })