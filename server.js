const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const multer = require('multer')
const OSSStorage = require('multer-aliyun-oss');
const app = express()
const server = http.createServer(app)

const storage = new OSSStorage({
  config: { // required
    region: 'oss-ap-southeast-5', //change with your region
    internal: false,
    accessKeyId: 'access-key-id',
    accessKeySecret: 'access-secret',
    bucket: 'bucketname' // you could using all oss option in ali-oss pacakge
  },
  destination: '' // return destination folder path, optional,  '' is default value
})

const upload = multer({
  storage
});

const cors = require("cors");
const corsOptions = {
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/upload_files', upload.any('upl', 25), function (req, res, next) {
  res.send({
      message: "Uploaded!",
      urls: req.files.map(function(file) {
          return {url: file.location, name: file.key, type: file.mimetype, size: file.size};
      })
  });
});
app.use((error, req, res, next) => {
  res.status(500).json({isError: true, error})
})
app.use((req, res) => {
  return res.status(404).json({isError: true, error: 'Router NOT FOUNDED'})
})
server.listen(5000, err => {
  if(err) return console.error('app start failed')
  console.info('app start at 5000')
})