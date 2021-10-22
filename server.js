const express = require('express');
const { getAppointments } = require("./get-appointments");
const { addAppointment } = require("./add-appointment");
const { cancelAppointment } = require("./cancel-appointment");
const { arriveAppointment } = require("./arrive-appointment");
const { addPatient } = require("./add-patient");
const { getPatient } = require("./get-patient");
const { addMessage } = require("./add-message");
const { getPatientAppointments } = require("./get-patientapts");
const { getUserBookedApts } = require("./get-userbookedapts");
const { getNumVisits } = require('./get-visitcount')
const {  getPatientInfo, updatePatientMedicare, updatePatientPension, updatePatientContacts, updatePatientAddress, updatePatientEmail } = require('./patient-info')

const app = express();
app.use(require("body-parser").json());
app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); 

app.post('/get-appointments', async (req, res) => {
  try {
    const result = await getAppointments(req);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/add-patient', async (req, res) => {
  try {
    const { titleCode, firstname, surname, dob, sexCode } = req.body
    const result = await addPatient(titleCode, firstname, surname, dob, sexCode);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/get-patient', async (req, res) => {
  try {
    const { surname, dob } = req.body
    const result = await getPatient(surname, dob);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/add-message', async (req, res) => {
  try {
    const { userID, subject, message, patID } = req.body
    const result = await addMessage(userID, subject, message, patID);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/add-appointment', async (req, res) => {
  try {
    const { aptDate, aptTime, aptType, practitionerID, patientID } = req.body
    const bookedApts = await getUserBookedApts(practitionerID, aptDate);
    // Check if the slot is taken already
    if (bookedApts.includes(aptTime)) {
      console.log("Slot taken")
      res.status(200).json(0);
    } else {
      // Check if patient has booked an appointment on the day already
      const result = await getPatientAppointments(patientID);
      const booked = result.filter((apt) => apt.aptDate === aptDate)
      if (booked.length > 0) {
        res.status(200).json(-1);
      } else {
        const result = await addAppointment(aptDate, aptTime, aptType, practitionerID, patientID);
        res.status(200).json(result);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/cancel-appointment', async (req, res) => {
  try {
    const { aptID } = req.body
    const result = await cancelAppointment(aptID);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/arrive-appointment', async (req, res) => {
  try {
    const { aptID } = req.body
    const result = await arriveAppointment(aptID);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/get-patientapts', async (req, res) => {
  try {
    const { patientID } = req.body
    const result = await getPatientAppointments(patientID);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/get-numvisits', async (req, res) => {
  try {
    const { patientID } = req.body
    const result = await getNumVisits(patientID);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/get-patientinfo', async (req, res) => {
  try {
    const { patientID } = req.body
    const result = await getPatientInfo(patientID);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/update-medicare', async (req, res) => {
  try {
    const { patientID, medicareNo, medicareLineNo, medicareExpiry } = req.body
    const result = await updatePatientMedicare(patientID, medicareNo, medicareLineNo, medicareExpiry);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/update-pension', async (req, res) => {
  try {
    const { patientID, pensionCode, pensionNo, pensionExpiry } = req.body
    const result = await updatePatientPension(patientID, pensionCode, pensionNo, pensionExpiry);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/update-contacts', async (req, res) => {
  try {
    const { patientID, homePhone, workPhone, mobilePhone } = req.body
    const result = await updatePatientContacts(patientID, homePhone, workPhone, mobilePhone);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/update-address', async (req, res) => {
  try {
    const { patientID, address1, city, postcode } = req.body
    const result = await updatePatientAddress(patientID, address1, city, postcode);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/update-email', async (req, res) => {
  try {
    const { patientID, email } = req.body
    const result = await updatePatientEmail(patientID, email);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

/*--------------------Routing Over----------------------------*/
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Express Started on Port ${port}`);
});