const fs = require('fs');
const { google } = require('googleapis');

// Define the scope for Google Drive API
const SCOPE = ['https://www.googleapis.com/auth/drive.file'];

let apikeys = require('../googledrivekey.json');

// A Function to authenticate and get access to Google Drive API
async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email, // Service account email
        null,
        apikeys.private_key, // Ensure private key is correctly formatted
        SCOPE
    );

    await jwtClient.authorize();
    return jwtClient;
}

// A Function to upload a file to Google Drive
async function uploadFile(authClient,folder,filename,filetype,filepath) {
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: 'v3', auth: authClient });

        const fileMetaData = {
            name: filename, // Name of the file in Drive
            parents: [folder], // Folder ID in Drive
        };
        console.log('filepath',filepath)
        const media = {
            mimeType: filetype,
            body: fs.createReadStream(filepath), // Path to the local file
        };

        drive.files.create(
            {
                resource: fileMetaData,
                media: media,
                fields: 'id', // Retrieve the file ID after upload
            },
            (error, file) => {
                if (error) {
                    console.log("Err in drive upload",error)
                    return reject(error);
                }
                resolve(file.data);
            }
        );
    });
}

// Main Function to orchestrate authorization and file upload
exports.fileUploadToDrive=async(folder,filename,filetype,filepath)=> {
    try {
        // Step 1: Authorize and get the auth client
        const authClient = await authorize();
        console.log('Authorization successful!');

        // Step 2: Upload file
        const uploadedFile = await uploadFile(authClient,folder,filename,filetype,filepath);
        console.log('File uploaded successfully:', uploadedFile);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}
