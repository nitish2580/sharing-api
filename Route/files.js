const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Uploads/"),
  filename: (req, file, cb) => {
    //For Generating the unique name
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 100000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (!req.file) {
      return res.json({ error: "All Fields are required" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //Store Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });

    //Response -> Link
  });
});
router.post('/send',async (req,res)=>{
  //validate request
  const{uuid,emailTo,emailFrom}=req.body;
  if(!uuid || !emailTo ||!emailFrom){
    return res.status(422).send({error:'All Fileds are Required except expiry.'});
  }
  //Get data from database
  const file=await File.findOne({
    uuid:uuid
  });
  if(file.sender){
    return res.status(422).send({error:'Email already sent.'});
  }
  file.sender=emailFrom;
  file.receiver = emailTo;
  const response=await file.save();

  //Send email
  const sendMail = require("../services/emailService");
  sendMail({
    from:emailFrom,
    to:emailTo,
    subject:'inShare file sharing',
    text:`${emailFrom} shared a file with you`,
    html:require('../services/emailTemplate')({
      emailFrom:emailFrom,
      downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size:parseInt(file.size/1000)+'KB',
      expires:'24 hours'
    })
  })
  return res.send({success:true})
})
module.exports = router;
