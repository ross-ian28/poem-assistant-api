// Get all users in database
app.get('/users', (req, res) => {
    database.collection("poem-assistant-collection").find({}).toArray((error, result) => {
        if (error) {
            res.json({ message: result });
        } else {
            res.json({ message: 'Error retrieving response' });
        }
    })
});