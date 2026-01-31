
import fs from 'fs';


function readInput (filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.log(`Error: ${filePath} not found.`);
        console.log(error);
        return '';
    }
}

function outputResults(text) {
    
    const results = {
        emails: [], 
        urls: [],
        phonenumbers: [],
        hashtags: [],
        currencyamounts: []
        
    };

    //Email
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    // Extract all matches from the text; default to an empty array if none found
    const emailMatches = text.match(emailRegex) || [];
    // Filter out malformed emails (security/validation check) and mask for privacy
    results.emails = emailMatches.filter(email => { // post-regex validation
        // Reject emails that contain double dots, which are invalid but often caught by loose regex
        return !email.includes('..');
    }).map(email => {
        const [localPart, domain] = email.split('@');
        // Mask the local part (username) while keeping the first and last characters visible
        if (localPart.length > 1) {
            return localPart[0] + '***' + localPart[localPart.length - 1] + '@' + domain; // Masking the local part (username) while keeping the first and last characters visible
        }
        return localPart + '***@' + domain; // 
    });

    //Url
    const urlregex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    // Extract all URL matches; default to an empty array
    const urlmatches = text.match(urlregex) || [];
    // Sanitize URLs to prevent malicious content from being processed downstream
    results.urls = urlmatches.filter(url => {
        // Security check: Block URLs that contain script tags or suspicious JavaScript protocols
        const lowerUrl = url.toLowerCase();
        return !lowerUrl.includes('<script>') && !lowerUrl.includes('javascript:');
    });

    //Phone Number
    const phoneregex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    // Store all valid-looking phone matches
    results.phonenumbers = text.match(phoneregex) || [];

    // Hashtag Extraction
    // Regex matches words starting with #
    const hashtagregex = /#\w+/g;
    // Store all hashtags found
    results.hashtags = text.match(hashtagregex) || [];
 
     // Currency Amount Extraction
    // Regex matches amounts starting with '$', handling commas for thousands and cent decimals
    const currencyregex = /\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g;
    // Store all found currency values
    results.currencyamounts = text.match(currencyregex) || [];

    return results;
}

function main(){
     // Reading all the input data from the text file
    const inputtext = readInput('input.txt');
    // Exit if the file was empty or could not be found

    if (!inputtext) return; // If the file is empty or not found, the program will exit
    // console.log(inputtext); // this can be used when you want to display your raw input data
    // Pass the text to the regex extraction function
    const outputedResults = outputResults(inputtext);

    // Printing the final structured data as a formatted JSON string
    // This makes the output machine-readable and easy to verify
    console.log(JSON.stringify(outputedResults, null, 4));
    // console.log(outputedResults); // this can be used when you don't want to display your results in JSON format
}

// Calling the main function to start the program
main();