import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import B2 from 'backblaze-b2';

const router = express.Router();
const b2 = new B2({
  applicationKeyId: '00577934899e4ea0000000001',
  applicationKey: 'K005AqURksbXopg6bE30Jobxu4ReWA0',
});
const bucketName = 'isomorphic-test1';

// Route for handling file uploads
router.post('/', (req, res) => {
    console.log('triggered')
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send('Error parsing form data');
    }

    const uploadedFile = files.file;
    console.log('uploadedFile.path', uploadedFile.filepath)
    // Upload file to Backblaze B2
    console.log()
    const fileStream = fs.createReadStream(uploadedFile.filepath);
    const uploadOptions = {
      fileName: uploadedFile.originalFilename,
      bucketName: bucketName,
    };

    b2.uploadFile(uploadOptions, fileStream)
      .then((response) => {
        // Delete the local file after successful upload
        fs.unlink(uploadedFile.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting local file:', unlinkErr);
          }
        });

        res.status(200).send('File uploaded successfully');
      })
      .catch((uploadErr) => {
        console.error('Error uploading file to Backblaze B2:', uploadErr);
        res.status(500).send('Error uploading file');
      });
  });
});

export default router;
