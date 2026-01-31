# alu_regex-data-extraction-nshutilancelot3

## Project Overview

This small Node.js utility extracts structured pieces of data from a plain text file (`input.txt`) using regular expressions. The program currently extracts:
- Emails (masked for privacy)
- URLs (basic sanitization)
- Phone numbers (North-American style formatting)
- Hashtags
- Currency amounts (USD-style with $)

The main source file is `program.js`.

## Prerequisites

- Node.js 14+ (recommended)
- A terminal in the project directory

Note: `package.json` declares the project as an ES module (`"type": "module"`), so run with a modern Node.js version.

## Files

- `program.js` — main program implementing input reading and regex extraction
- `input.txt` — (not included) place your plain-text input here
- `package.json` — project metadata (already configured as an ES module)

## Install

No additional packages are strictly required (the project uses the built-in `fs` module). If you want to install dependencies from `package.json` run:

```bash
npm install
```

## Run

Place the text to analyze in `input.txt` at the project root, then run:

```bash
node program.js
```

The program prints a JSON object to STDOUT containing the extracted fields.

## How the program works (function-level)

**readInput(filePath)**: synchronously reads the file at `filePath` using `fs.readFileSync(..., 'utf8')`. If the file cannot be read it logs an error and returns an empty string.

**outputResults(text)**: processes the provided `text` and returns an object with arrays for each extracted data type. Current behavior:

- Emails
  - Regex used: `/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g`
  - Matches are filtered to reject addresses containing `..`.
  - Local-part (left of `@`) is masked: first char + `***` + last char + `@domain` (if local part length > 1).

- URLs
  - Regex used: `https?:\/\/...` (a common broad pattern).
  - Matches are filtered to exclude values containing `<script>` or `javascript:` (basic sanitization).

- Phone numbers
  - Regex used: `(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}` — captures common North American formats and optional international prefix.

- Hashtags
  - Regex used: `/#\w+/g` — finds words starting with `#`.

- Currency amounts
  - Regex used: `/\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g` — USD-style amounts with optional thousands separators and cents.

The function returns a `results` object like:

```json
{
  "emails": ["a***z@example.com"],
  "urls": ["https://example.com"],
  "phonenumbers": ["(123) 456-7890"],
  "hashtags": ["#example"],
  "currencyamounts": ["$1,234.56"]
}
```

## Output

The `main()` function in `program.js` reads `input.txt`, calls `outputResults(...)`, and prints the JSON result using `console.log(JSON.stringify(..., null, 4))`.

## Example

1. Create an `input.txt` with the following content:

```
Contact: alice.smith@example.com or visit https://example.com. Call +1 (555) 123-4567. Price: $12.50. #promo
```

2. Run:

```bash
node program.js
```

3. Expect a JSON output containing masked email, URL, phone, hashtag and currency.

## Known issues & suggestions (important)

- `program.js` currently contains comment lines and some TODO-style notes; these do not affect functionality but you may want to clean them for production.
- The email regex includes a `|` inside the character class (`[A-Z|a-z]`) which is unnecessary — it still works but the `|` is treated as a literal. Prefer `[A-Za-z]` or the case-insensitive flag `i`.
- `package.json` lists `fs` under `dependencies`. `fs` is a built-in Node module and should not be installed from npm; you can safely remove that dependency entry.
- The program uses synchronous file I/O (`readFileSync`) which is fine for small inputs, but consider async I/O for large files or server usage.
- No CLI flags are implemented. Consider adding options to specify input file path or output format.

## TODO / Improvements

- Add unit tests for each regex extractor.
- Add optional command-line arguments (input path, output file, verbose mode).
- Improve email validation (use a stricter validation library if necessary).

## License

ISC


---



