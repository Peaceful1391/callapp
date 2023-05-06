const express = require('express')
const app = express()
const port = 8080

const fs = require('fs')
const cors = require('cors')
const readline = require('readline');

const backupDataPath = './data/backup.json'
const userDataPath = './data/users.json'

app.use(cors())
app.use(express.json())

  
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptOverwrite() {
    rl.question('Do you want to overwrite the users file with the backup file type? (optional) (y/n) ', answer => {
      if (answer.toLowerCase() !== 'y') {
            console.log('File not overwritten');
            rl.close();
            return;
        }
    
        fs.readFile(backupDataPath, 'utf8', (err, backupData) => {
            if (err) {
                console.error(err);
                rl.close();
                return;
            }
    
            fs.writeFile(userDataPath, backupData, 'utf8', err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('File overwritten');
                }
                rl.close();
            });
        });
    });
}

app.get('/users', (req, res) => {
    fs.readFile(userDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('Unable to read the data file')
        } else {
            res.json(JSON.parse(data))
        }
    })
})

app.post('/users', (req, res) => {
    fs.readFile(userDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('Unable to read the data file')
        } else {
            let users = JSON.parse(data);
            if (!users) {
                users = [];
            }
            
            const newUser = {
                id: users.length + 1,
                ...req.body
            };

            users.push(newUser);

            fs.writeFile(userDataPath, JSON.stringify(users), (err) => {
                if (err) {
                    console.error(err)
                    res.status(500).send('Unable to add user to the data file')
                } else {
                    res.send('User was added to the data file')
                }
            })

            res.json(users)
        }
    })
})

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    fs.readFile(userDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to read the data file');
        } else {
            const users = JSON.parse(data);
            if (!users) {
                users = [];
            }
            const updatedUser = req.body;
            updatedUser.id = userId;
            const index = users.findIndex(user => user.id === userId);

            if (index === -1) {
                res.status(404).send('User not found');
            } else {
                users[index] = updatedUser;
                fs.writeFile(userDataPath, JSON.stringify(users), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Unable to update user');
                    } else {
                        res.send('User updated successfully');
                    }
                });
                res.json(users)
            }
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    fs.readFile(userDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to read the data file');
        } else {
            const users = JSON.parse(data);
            if (!users) {
                users = [];
            }
            const index = users.findIndex(user => user.id === userId);
            if (index === -1) {
                res.status(404).send('User not found');
            } else {
                users.splice(index, 1);
                for (let i = index; i < users.length; i++) {
                    users[i].id--;
                }
                fs.writeFile(userDataPath, JSON.stringify(users), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Unable to delete user');
                    } else {
                        res.send('User deleted successfully');
                    }
                });
                res.json(users)
            }
        }
    });
});

app.listen(port, () => {
    console.log("listening on:", `http://localhost:${port}`);
    promptOverwrite();
});