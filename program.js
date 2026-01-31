
/**
 * Simple data-extraction utility.
 * Reads plain text input and extracts emails, URLs, phone numbers,
 * hashtags and currency amounts using regular expressions.
 */
import fs from 'fs';


/**
 * Read a text file synchronously and return its contents as a string.
 * Returns an empty string if the file cannot be read.
 *
 * @param {string} filePath - Path to the input file to read
 * @returns {string} file contents or '' on error
 */
function readInput (filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.log(`Error: ${filePath} not found.`);
        console.log(error);
        return '';
    }
}


/**
 * Extract structured data from a text string.
 * Returns an object containing arrays for each data type.
 *
 * @param {string} text - The raw text to analyze
 * @returns {Object} results object with keys: emails, urls, phonenumbers, hashtags, currencyamounts
 */
function outputResults(text) {
    // Container for extracted values
    const results = {
        emails: [],
        urls: [],
        phonenumbers: [],
        hashtags: [],
        currencyamounts: []
    };

    // Email extraction
    // Note: the character class [A-Z|a-z] includes a '|' literal; a case-insensitive flag (i)
    // or [A-Za-z] would be preferable, but we keep the existing pattern here.
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatches = text.match(emailRegex) || [];
    // Basic post-regex validation: reject addresses containing consecutive dots
    results.emails = emailMatches.filter(email => !email.includes('..')).map(email => {
        const [localPart, domain] = email.split('@');
        // Mask the local part for privacy: keep first and last char when possible
        if (localPart.length > 1) {
            return localPart[0] + '***' + localPart[localPart.length - 1] + '@' + domain;
        }
        return localPart + '***@' + domain;
    });

    // URL extraction (broad pattern)
    // The regex captures http/https URLs and a wide range of allowed characters
    const urlregex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const urlmatches = text.match(urlregex) || [];
    // Very basic sanitization: drop obvious script/javascript URIs
    results.urls = urlmatches.filter(url => {
        const lowerUrl = url.toLowerCase();
        return !lowerUrl.includes('<script>') && !lowerUrl.includes('javascript:');
    });

    // Phone number extraction
    // Pattern matches common North-American formats and optional international prefix
    const phoneregex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    results.phonenumbers = text.match(phoneregex) || [];

    // Hashtag extraction: words that start with '#'
    const hashtagregex = /#\w+/g;
    results.hashtags = text.match(hashtagregex) || [];

    // Currency extraction: USD-style values with optional commas and cents
    const currencyregex = /\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g;
    results.currencyamounts = text.match(currencyregex) || [];

    return results;
}


/**
 * Main entry point: read `input.txt`, extract values and print JSON to stdout.
 */
function main(){
    const inputtext = readInput('input.txt');
    if (!inputtext) return; // exit if read failed or file is empty
    const outputedResults = outputResults(inputtext);
    // Pretty-print the extracted results as JSON
    console.log(JSON.stringify(outputedResults, null, 4));
}

main();