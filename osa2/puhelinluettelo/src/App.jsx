import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
    setShowAll(event.target.value === "")
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value);
  }

  const notification = (type, message) => {
          setMessageType(type)
          setErrorMessage(message)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
  
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          notification('notification',`Deleted ${personToDelete.name}`)
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== personToDelete.id))
          notification('error',`The person '${personToDelete.name}' was already removed from the server.`)
        })
    }
  }
  

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
  
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to the phonebook, replace the old number with a new one?`)) {
        changeNumber(existingPerson, newNumber)
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      };
  
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        
        notification('notification',`Added ${personObject.name}`)
        })
        .catch(error => {
          console.log(error.response.data)
          notification('error', error.response.data.toString())
        })
    }
  }
  
  const changeNumber = (existingPerson, newNumber) => {
    const updatedPerson = { ...existingPerson, number: newNumber }
        
    personService
      .update(existingPerson.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setPersons(persons.filter(person => person.id !== existingPerson.id))
        notification('error',`The person '${existingPerson.name}' was already removed from the server.`)
      })
  }

  const personsToShow = showAll
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} className={messageType} />
      <Filter filter={newFilter} handleChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm 
      name={newName} add={addPerson} handleNameChange={handleNameChange}
      number={newNumber} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>

      <Persons persons={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App