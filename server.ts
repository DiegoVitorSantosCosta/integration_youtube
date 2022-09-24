import express, { Request, Response } from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
const app = express();
const port = 3000;
app.use(cors());
const yt = google.youtube({ version: 'v3' })
let auth: OAuth2Client;
let authorizationToken = null;

async function robot() {
    await createOauthClient()

}
robot();




async function createOauthClient() {
    let credentials = require('./yt.json');

    auth = new google.auth.OAuth2({
        clientId: credentials.web.client_id,
        clientSecret: credentials.web.client_secret,
        redirectUri: credentials.web.redirect_uris[0]
    });
    await requestUserConsent(auth);

}
async function requestUserConsent(OauthClient: OAuth2Client) {
    const consentUrl = OauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ["https://www.googleapis.com/auth/youtube"]
    });
    console.log("please give your consent: ", consentUrl);

}
async function requestGoogleAcesstoken(Oauth: OAuth2Client, authorizationToken: any) {
    Oauth.getToken(authorizationToken, async (err, token: any) => {
        if (err) {
            console.log(err)
            return err
        }
        console.log('my acess token', token);
        Oauth.setCredentials(token);
        google.options({
            auth: Oauth
        })

    })

}
app.get('/videos', async (req: Request, res: Response) => {
    // let videos = await yt.subscriptions.list({

    //     auth: auth,

    //     mine: true,
    //     part: ['snippet', 'contentDetails'],
    //     maxResults: 50
    // });
    let videos = await yt.playlistItems.list({

        part: ['contentDetails', 'status', 'snippet'],

        // mine: true,
        playlistId: 'UUfivWk5yd2EornL1TJSt7Qg'

        // chart: 'mostPopular',
        // myRating: 'like'
        // auth: auth,

        // mine: true,
        // part: ['snippet', 'contentDetails'],
        // maxResults: 50
    });
    res.json(videos)

})
app.get('/authtoken', async (req: Request, res: Response) => {
    authorizationToken = req.query.code;

    await requestGoogleAcesstoken(auth, authorizationToken)
    res.send('<h1>Thank you </h1>');




})
app.listen(port, () => {
    console.log('Rodando na porta', port)
})