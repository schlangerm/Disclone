const models = require('../db/models');

async function setupUserRoutes(app) {

    app.get('/api/user/notifications', (req, res) => {
        console.log(`user:  ${req.user.id} requesting notifications`);

        //db call to get notifications 

        res.status(200).json({
            success: true,
            error: null,
            data: {
                results: notifications
            },
        });
    });

    app.get('/api/user', (req, res) => {
        console.log(`user ${req.user.id} requesting user data`);
        
        res.status(200).json({
            success: true,
            error: false,
            data: {
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email
                }
            }
        });
    })

    app.put('/api/user/displayname', async (req, res) => {
        // requires newName in body, auth header
        console.log(`user: ${req.user.id} requesting to change display name`);
        const newName = req.body.newName.trim();
        await models.User.update({ name: newName },
            { where: { id: req.user.id } })
            .then(([rowsUpdated]) => {
                if (rowsUpdated > 0) {
                    console.log(`user ${req.user.id} updated name to ${newName}`);
                    res.status(200).json({
                        success: true,
                        error: null,
                        data: {
                            results: newName
                        }
                    });
                } else { // TODO: check if not found is the only way this can go wrong without an error thrown
                    res.status(404).json({
                        success: false,
                        error: 'User not found',
                        data: null
                    });
                }  
            })
            .catch((error) => {
                console.log(`error updating name of user ${req.user.id}: \n${error}`);
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error',
                    data: null
                });
            });
    });

    app.delete('/api/user/delete', async (req, res) => {

        console.log(`user: ${req.user} requesting to delete their account`);
        
        await models.User.destroy({ where: { id: req.user.id } })
        .then((rowsDeleted) => {
            if (rowsDeleted > 0) {
                console.log(`user ${req.user.id} deleted their account successfully`);
                res.status(200).json({
                    success: true,
                    error: null,
                    data: `Account ${req.user.id} deleted`
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                    data: null
                });
            }
        })
        .catch((error) => {
            console.log(`error deleting account ${req.user.id}: \n${error}`);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                data: null
            });
        });
    });
}

module.exports = setupUserRoutes;