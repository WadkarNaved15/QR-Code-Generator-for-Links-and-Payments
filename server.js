import express from 'express';
import qrcode from 'qrcode';
import bodyParser from 'body-parser';
import path from 'path';
import multer from 'multer';

const app = express();
const port = 3000;
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const upload = multer();

// Route to serve the index.html file
app.get("/", async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Route to generate and display the QR code
app.post('/qrcode', upload.none(), async (req, res) => {
    const link = req.body.links;
    const qrCodeData = await qrcode.toDataURL(link);
    const data = `
    <h3>QR Code for: ${link}</h3>
    <img id="dimg" src="${qrCodeData}" alt="QR Code">
    <a href="${qrCodeData}" download="qrcode.png"><button id="download">Download QR Code</button></a>
    `;
    res.send(data);
});

app.use(express.json());


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

// Function to generate an automatic reference ID
function generateReferenceId() {
    const timestamp = Date.now().toString(); // Get current timestamp
    const randomString = generateRandomString(8); // Generate a random alphanumeric string
    return `${timestamp}-${randomString}`; // Combine timestamp and random string
}

// Route to generate transaction link
app.post('/transaction-link',upload.none(), async(req, res) => {
    const upiId = req.body.upiId;
    const amount = req.body.amount;
    const currency = req.body.currency;

    const transactionDetails = {
        upiId: upiId, // Replace with the recipient's UPI ID
        amount: amount,
        currency: currency,
        description: 'Payment for XYZ', // Description of the payment
        referenceId: generateReferenceId() // Generate automatic reference ID
    };

    // Construct the transaction link URL
    const transactionLink = `upi://pay?pa=${transactionDetails.upiId}&am=${transactionDetails.amount}&cu=${transactionDetails.currency}&tn=${encodeURIComponent(transactionDetails.description)}&tid=${transactionDetails.referenceId}`;

    const qrCodeData = await qrcode.toDataURL(transactionLink);
    // Send the transaction link as a response
    res.send(`
        <div class="transaction">
            <h3>Transaction Link :</h3>
            <p><a href="${transactionLink}">Click here to initiate payment</a></p>
        </div>
        <img id="dpimg" src="${qrCodeData}" alt="QR Code">
        <a href="${qrCodeData}" download="qrcode.png"><button id="downloadp">Download QR Code</button></a>
    `);
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

