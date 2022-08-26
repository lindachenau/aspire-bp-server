const express = require('express');
const fs = require('fs');
const https = require('https');
const { getAppointments } = require("./get-appointments");
const { addAppointment } = require("./add-appointment");
const { cancelAppointment } = require("./cancel-appointment");
const { arriveAppointment } = require("./arrive-appointment");
const { addPatient } = require("./add-patient");
const { getPatient } = require("./get-patient");
const { addMessage } = require("./add-message");
const { getPatientAppointments } = require("./get-patientapts");
const { isAppointmentBooked } = require("./isAppointmentBooked");
const { getNumVisits } = require('./get-visitcount')
const {  getPatientInfo, updatePatientMedicare, updatePatientPension, updatePatientDVA, updatePatientContacts, updatePatientAddress, 
  updatePatientEmail, setEmergencyContact, setNextOfKin, updateHealthFund, updatePatient } = require('./patient-info')
const { localDate } = require("./util")
const { appointmentStatus } = require('./appointment-status')
const { confirmAppointment } = require('./appointment-attendance')
const { getAppointmentsOnDate } = require('./get-appointments-on-date')
const { contactByPhone }= require('./contact-lookup')

const app = express();
app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
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
    const { titleCode, firstname, surname, dob, sexCode, address1, city, postcode, 
      email, homePhone, workPhone, mobilePhone, medicareNo, medicareLineNo, medicareExpiry, pensionCode, pensionNo, pensionExpiry, ethnicCode } = req.body
    const result = await addPatient(titleCode, firstname, surname, dob, sexCode, address1, city, postcode, 
      email, homePhone, workPhone, mobilePhone, medicareNo, medicareLineNo, medicareExpiry, pensionCode, pensionNo, pensionExpiry, ethnicCode);
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

/*
 * Check if the requested slot is still available first and then check incomplete bookings. Return
 * 0: The slot has been taken
 * -1: A booking exists on the same day
 * -2: Booking request is blocked because the patient has failed attendances >= 3
 */
app.post('/add-appointment', async (req, res) => {
  try {
    const { aptDate, aptTime, aptDuration, aptType, practitionerID, patientID } = req.body
    const booked = await isAppointmentBooked(practitionerID, aptDate, aptTime)
    // Check if the slot is taken already
    if (booked) {
      console.log("Slot taken")
      res.status(200).json(0);
    } else {
      // Check if patient has booked an appointment on the day already
      const result = await getPatientAppointments(patientID);
      const booked = result.filter((apt) => apt.aptDate === aptDate)

      // Check past failed bookings
      // Today at 0:0 am
      let today = new Date()
      today.setHours(0, 0, 0)
      const history = result.filter(apt => {
        const slot = localDate(apt.aptDate, apt.aptTime)
        return (slot <= today) ? apt : null
      })            

      if (booked.length > 0) {
        console.log("The patient has booked an appointment on the requested date.")
        res.status(200).json(-1);
      } else if (history.length >= 3) {
        console.log("The patient has failed to attend appointments 3 times")
        res.status(200).json(-2);
      } else {
        const result = await addAppointment(aptDate, aptTime, aptDuration, aptType, practitionerID, patientID);
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

app.post('/update-DVA', async (req, res) => {
  try {
    const { patientID, dVACode, dVANo } = req.body
    const result = await updatePatientDVA(patientID, dVACode, dVANo);
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

app.post('/appointment-status', async (req, res) => {
  try {
    const { id } = req.body
    const result = await appointmentStatus(id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/confirm-appointment', async (req, res) => {
  try {
    const { id } = req.body
    const result = await confirmAppointment(id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/appointments-ondate', async (req, res) => {
  try {
    const { date } = req.body
    const result = await getAppointmentsOnDate(date);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.get('/contacts', async (req, res) => {
  try {
    const { phone } = req.query
    const result = await contactByPhone(phone);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/set-emergency-contact', async (req, res) => {
  try {
    const { patientID, firstname, surname, contactPhone, relationship } = req.body
    const result = await setEmergencyContact(patientID, firstname, surname, contactPhone, relationship);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/set-next-of-kin', async (req, res) => {
  try {
    const { patientID, firstname, surname, contactPhone, relationship } = req.body
    const result = await setNextOfKin(patientID, firstname, surname, contactPhone, relationship);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/update-healthfund', async (req, res) => {
  try {
    const { patientID, healthFundNo, healthFundName, healthFundExpiry } = req.body
    const result = await updateHealthFund(patientID, healthFundNo, healthFundName, healthFundExpiry);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

app.post('/update-patient', async (req, res) => {
  try {
    const { patientID, titleCode, firstname, surname, dob, sexCode, address1, city, postcode, 
      email, homePhone, workPhone, mobilePhone, medicareNo, medicareLineNo, medicareExpiry, 
      pensionCode, pensionNo, pensionExpiry, dVACode, dVANo, ethnicCode } = req.body
    const result = await updatePatient(patientID, titleCode, firstname, surname, dob, sexCode, address1, city, postcode, 
      email, homePhone, workPhone, mobilePhone, medicareNo, medicareLineNo, medicareExpiry, 
      pensionCode, pensionNo, pensionExpiry, dVACode, dVANo, ethnicCode);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

/*--------------------Routing Over----------------------------*/
https.createServer({
  key: fs.readFileSync('STAR_aspiremedicalcentre_com_au.key'),
  cert: fs.readFileSync('STAR_aspiremedicalcentre_com_au.crt')
}, app)
.listen(5000, function () {
  console.log('Express started on port 5000')
});
