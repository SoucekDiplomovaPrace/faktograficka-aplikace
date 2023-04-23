const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://SoucekDiplomovaPrace:BrutalAssault703@faktografickaaplikace.chh7asi.mongodb.net/?retryWrites=true&w=majority')
//'mongodb://localhost:27017/db'

const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))