import express from 'express';
import multer from 'multer';
import B2 from 'backblaze-b2';
import fs from 'fs';

const router = express.Router();

// Set up Backblaze B2 credentials
const b2 = new B2({
  applicationKeyId: '00577934899e4ea0000000001',
  applicationKey: 'K005AqURksbXopg6bE30Jobxu4ReWA0',
});

// Authorize with Backblaze B2
b2.authorize().catch((error) => {
  console.error('Error authorizing with Backblaze B2:', error);
});

// Configure Multer storage
const upload = multer({
  storage: multer.memoryStorage(),
});


// Define the route for handling file uploads
router.post('/', upload.single('file'), async (req, res) => {
  const uploadedFile = req.file;
  try {

    const uploadUrl = await b2.getUploadUrl('07e749e3246869198e840e1a');

    const fileInfo =  await b2.uploadFile({
      uploadUrl:uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName: uploadedFile.originalname,
      data: req.file.buffer,
    });
    console.log('done', fileInfo.data)
    res.status(200).json(fileInfo.data);
  } catch (error) {
    console.error('Error uploading file to Backblaze B2:', error);
    res.status(500).send('Error uploading file');
  }
});

router.delete('/',  async (req, res) => {
  const deleteFile = req;
  console.log('delete, req', req.body, req.query)
  try {

    const response = await b2.deleteFileVersion(req.query);
    console.log(response)
    // const uploadUrl = await b2.getUploadUrl('07e749e3246869198e840e1a');

    // const fileInfo =  await b2.uploadFile({
    //   uploadUrl:uploadUrl.data.uploadUrl,
    //   uploadAuthToken: uploadUrl.data.authorizationToken,
    //   fileName: uploadedFile.originalname,
    //   data: req.file.buffer,
    // });

    res.status(200).json("deleted");
  } catch (error) {
    console.error('Error uploading file to Backblaze B2:', error);
    res.status(500).send('Error uploading file');
  }
});

export default router;
