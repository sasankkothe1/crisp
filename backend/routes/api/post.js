// routes/api/post.js

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

// Load Post model
const { PostModel } = require('../../model/Post');

const imageFormats = ['png', 'jpg', 'jpeg']
const videoFormats = ['.gif', '.mp4', '.mov', '.wmv', '.avi']

// @route GET api/posts/test
// @description tests posts route
// @access Public
router.get('/test', (req, res) => res.send('post route testing!'));

// to get all the posts populated by the user created "postedBy"
router.get('/all', (req, res) => {
  PostModel.find()
    .populate('postedBy')
    .exec()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPostsFound: 'No Posts Found' }));
});

// to get post with specific id
router.get('/:id', (req, res) => {
  PostModel.findById(req.params.id)
    .populate('postedBy')
    .exec()
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ noPostFound: 'No Post Found' }))
})

// to post a new recipe
router.post('/', (req, res) => {
  if (Object.keys(req.body).length === 0) return res.status(400).json({
    error: 'Bad Request',
    message: 'The request body is empty'
  });

  // url to store the media (images/files). Format example: http://<host>/public/uploads/images
  let recievedFiles = req.files;
  let media = []
  const url = req.protocol + '://' + req.get('host'); //getting the host url

  if (recievedFiles.length > 0) {
    for (var i = 0; i < recievedFiles.length; i++) {
      var filetype = recievedFiles[i].filename.substr(recievedFiles[i].filename.lastIndexOf('.') + 1);
      filetype = imageFormats.includes(filetype) ? 'image' : 'video';
      let fileName = recievedFiles[i].filename.toLowerCase().split(' ').join('-')

      if (filetype === 'image') {
        media.push(url + '/public/uploads/images/' + uuidv4() + "-" + fileName)
      }
      if (filetype === 'video') {
        media.push(url + '/public/uploads/videos/' + uuidv4() + "-" + fileName)
      }

    }
  }
})

module.exports = router;