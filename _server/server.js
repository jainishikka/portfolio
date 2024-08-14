import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define a root route to handle GET requests to "/"
app.get('/', (req, res) => {
    res.send('Welcome to the Express server!'); // This will be displayed when you visit http://localhost:3000/
});

// Handle POST request to /contact
app.post('/contact', (req, res) => {
    const formData = req.body;

    // Define the file path
    const filePath = './data/contacts.json';

    // Read existing data (if any)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err.message);
            return res.status(500).json({ message: 'Error reading file', error: err.message });
        }

        let contacts = [];
        try {
            // Parse existing data or create an empty array
            contacts = data ? JSON.parse(data) : [];
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr.message);
            return res.status(500).json({ message: 'Error parsing JSON data', error: parseErr.message });
        }

        // Add the new form data to the contacts array
        contacts.push(formData);

        // Save the updated contacts array to the file
        fs.writeFile(filePath, JSON.stringify(contacts, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr.message);
                return res.status(500).json({ message: 'Error writing file', error: writeErr.message });
            }

            res.status(200).json({ message: 'Form data saved successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
