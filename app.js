const express = require('express')
const fileUpload = require('express-fileupload');
var fs = require('fs');
const app = express();

app.use(fileUpload());

app.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<form action="upload" method="post" enctype="multipart/form-data">');
  res.write('<input type="file" name="sampleFile"><br>');
  res.write('<input type="submit" value="upload">');
  res.write('</form>');
  return res.end();
})


app.get('/list',(req,res)=>{
  
  let filenames = fs.readdirSync('./');
  let images = [];
    filenames.forEach((filename)=>{
      if(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filename)) {
        images.push(filename);
      }
      
    })
    res.send(images)
  
});
app.delete('/:name',(req,res)=>{
  const filePath = `./${req.params.name}`;
  fs.unlink(filePath, (err)=>{
    if(err) {
      console.log('err',err);
      res.send('unable to delete file');
    } else {
      res.send('deleted');
    }
  })
  
  
});
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  let fileName = sampleFile.name + sampleFile.md5;
  console.log(fileName); 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`./${sampleFile.name}`, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});
//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})