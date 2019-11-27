var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var db = require('../node_modules/.bin/models');

var app = express();

app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/home', function(req,res){
  res.sendfile(__dirname + '/index.html');
 }); 

router.get('/test',function(req,res,next) {
  res.send('This is localhost:3000/test')
})

router.get('/api/contacts', (req, res) => {
  return db.Contact.findAll()
    .then((contacts) => res.send(contacts))
    .catch((err) => {
      console.log('There was an error querying contacts', JSON.stringify(err))
      return res.send(err)
    });
});

router.post('/api/contacts', (req, res) => {
  const { firstName, lastName, phone, email } = req.body
  return db.Contact.create({ firstName, lastName, phone, email })
    .then((contact) => res.send(contact))
    .catch((err) => {
      console.log('***There was an error creating a contact', JSON.stringify(contact))
      return res.status(400).send(err)
    })
});

router.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  return db.Contact.findByPk(id)
    .then((contact) => contact.destroy({ force: true }))
    .then(() => res.send({ id }))
    .catch((err) => {
      console.log('***Error deleting contact', JSON.stringify(err))
      res.status(400).send(err)
    })
});

router.put('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  return db.Contact.findByPk(id)
  .then((contact) => {
    const { firstName, lastName, phone } = req.body
    return contact.update({ firstName, lastName, phone })
      .then(() => res.send(contact))
      .catch((err) => {
        console.log('***Error updating contact', JSON.stringify(err))
        res.status(400).send(err)
      })
  })
});
module.exports = router;
