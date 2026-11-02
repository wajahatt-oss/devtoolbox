export interface ToolContent {
  title: string
  description: string
  introduction: [string, string]
  guidance: string
  faqs: { question: string; answer: string }[]
}

export const toolContent: Record<string, ToolContent> = {
  'json-formatter': {
    title: 'JSON Formatter and Validator',
    description: 'Format, validate, and minify JSON online. Adjust indentation, inspect syntax errors, and copy readable JSON with browser-side processing.',
    introduction: [
      'JSON is a compact data format used throughout web APIs, configuration files, and application logs. This free JSON formatter makes nested objects and arrays easier to inspect by adding consistent indentation, while its validator reports malformed input instead of silently changing it.',
      'Use the minify option to remove presentation whitespace when you need a compact representation. Formatting and validation happen in your browser, so the JSON you paste is not uploaded to a conversion service. Remember that formatting checks syntax, not the meaning or safety of the data.',
    ],
    guidance: 'Paste a JSON object or array, choose Format or Minify, select an indentation width, and run the formatter. Copy or download the result when it is ready.',
    faqs: [
      { question: 'What JSON input is accepted?', answer: 'Any valid JSON value is accepted, including objects, arrays, strings, numbers, booleans, and null. JavaScript comments and trailing commas are not valid JSON.' },
      { question: 'Can the formatter fix invalid JSON automatically?', answer: 'No. It reports a parsing error so you can correct the source deliberately; it does not guess whether a quote, comma, or other character should be changed.' },
      { question: 'Is my JSON sent to a server?', answer: 'The formatting and minification run locally in your browser. Avoid pasting secrets into any shared or managed device, and do not treat formatting as encryption.' },
    ],
  },
  'jwt-decoder': {
    title: 'JWT Decoder',
    description: 'Decode a JSON Web Token header and payload in your browser. Inspect common claims and expiry timestamps without uploading the token.',
    introduction: [
      'A JSON Web Token is commonly made from a Base64URL-encoded header, a payload, and a signature, joined by periods. This decoder helps developers inspect the readable header and claims during debugging, including standard timestamps such as exp and iat when present.',
      'Decoding is not signature verification. Anyone can read an unsigned or modified payload, so the decoded claims must not be trusted until a backend verifies the signature and relevant issuer, audience, and expiry rules. Use test tokens and keep production credentials private.',
    ],
    guidance: 'Paste a three-part JWT and select Decode. Review the header, payload, and signature text separately; the displayed claims are informational only.',
    faqs: [
      { question: 'Does decoding verify the JWT signature?', answer: 'No. This tool only decodes the token components. It does not have a signing key and cannot establish authenticity or integrity.' },
      { question: 'Why does a token contain readable information?', answer: 'JWT compact serialization often uses Base64URL encoding, which is an encoding rather than encryption. Do not put confidential data in a token unless an appropriate encryption scheme is used.' },
      { question: 'What does an exp claim mean?', answer: 'The exp claim is a Unix time in seconds after which a token should no longer be accepted. A server must enforce expiration and validate other claims as appropriate.' },
    ],
  },
  'uuid-generator': {
    title: 'UUID v4 Generator',
    description: 'Generate one or more random UUID version 4 identifiers using your browser’s cryptographically secure random number generator.',
    introduction: [
      'UUID version 4 identifiers are 128-bit values whose random portion is generated using a cryptographically secure source. They are useful for correlation IDs, test fixtures, and identifiers where decentralized generation is convenient.',
      'This generator uses the browser Web Crypto API and runs on your device. UUIDs are designed to make collisions extremely unlikely, not mathematically impossible; use a database constraint when uniqueness must be enforced for a critical system.',
    ],
    guidance: 'Choose a quantity from 1 to 100 and select Generate. Copy an individual identifier, copy the complete list, or download the generated values.',
    faqs: [
      { question: 'Which UUID version does this tool create?', answer: 'It creates UUID version 4 values, which are random identifiers with the version and variant bits set according to the UUID standard.' },
      { question: 'Are the generated UUIDs cryptographically secure?', answer: 'Generation uses the browser’s Web Crypto randomUUID API. Availability depends on a modern browser and a secure context such as HTTPS or localhost.' },
      { question: 'Can UUID collisions happen?', answer: 'A collision is possible in principle, although the probability for correctly generated UUID v4 values is very small. Enforce uniqueness in systems where duplicates would be consequential.' },
    ],
  },
  'base64-encoder-decoder': {
    title: 'Base64 Encoder and Decoder',
    description: 'Encode UTF-8 text as Base64 or decode Base64 back to text. Transformations run locally in your browser.',
    introduction: [
      'Base64 represents bytes with a set of printable ASCII characters. Developers encounter it in data URLs, email attachments, and text-oriented protocols that need to carry binary content; encoding increases the payload size and is not encryption.',
      'This tool handles UTF-8 text in both directions. If decoding fails, the input may contain invalid Base64 characters or bytes that are not valid UTF-8. For arbitrary binary files, use a byte-oriented workflow rather than assuming every decoded byte sequence is text.',
    ],
    guidance: 'Choose Encode or Decode, paste the text in the input field, and run the conversion. Use Swap to reuse the current output in the opposite mode.',
    faqs: [
      { question: 'Does Base64 protect or encrypt data?', answer: 'No. Base64 is a reversible encoding. Anyone with the encoded value can decode it, so it must not be used to protect passwords, keys, or private information.' },
      { question: 'Does this support Unicode text?', answer: 'Yes. Text is converted using UTF-8 so characters outside the basic ASCII range can be encoded and decoded.' },
      { question: 'Why is my Base64 rejected?', answer: 'The text may have an invalid alphabet, padding, or decoded byte sequence. Check for accidental characters or use a byte-aware tool if the data is not text.' },
    ],
  },
  'sql-formatter': {
    title: 'SQL Formatter',
    description: 'Format SQL queries for readability with configurable indentation and keyword casing. SQL formatting runs in your browser.',
    introduction: [
      'Long SQL statements are easier to review when clauses, joins, and nested expressions are laid out consistently. This SQL formatter uses the sql-formatter parser library to indent a query and optionally normalize keyword capitalization.',
      'Formatting changes presentation, not query intent, and it does not execute SQL or connect to a database. Review the resulting query before using it, particularly when the input contains dialect-specific syntax or application-generated fragments.',
    ],
    guidance: 'Paste a SQL statement, set keyword casing and indentation, then choose Format SQL. Review the formatted text before copying it into your editor.',
    faqs: [
      { question: 'Does formatting run my SQL?', answer: 'No. The tool only parses and formats query text in your browser. It never connects to or executes against a database.' },
      { question: 'Which SQL dialect should I use?', answer: 'The current formatter uses its generic SQL language mode. Dialect-specific extensions may not be formatted exactly as your database expects.' },
      { question: 'Can a formatted query change its meaning?', answer: 'The formatter is intended to change whitespace and keyword casing only. Still review the output and test it in a safe environment before running important queries.' },
    ],
  },
  'url-encoder-decoder': {
    title: 'URL Encoder and Decoder',
    description: 'Percent-encode or decode URL component text, including spaces and Unicode, directly in your browser.',
    introduction: [
      'URLs use a limited set of characters in each component. Percent-encoding represents reserved or non-ASCII characters as UTF-8 bytes written with hexadecimal escapes, which is useful when constructing query values or inspecting a value copied from a request.',
      'This encoder works on a component rather than transforming a complete URL into a safe, validated address. Encode each path or query value as appropriate; delimiters such as slash and ampersand have structural meaning in a URL and should not be indiscriminately encoded or decoded.',
    ],
    guidance: 'Select Encode or Decode, enter a single URL component, and run the conversion. Invalid percent escapes produce a clear error instead of a partial result.',
    faqs: [
      { question: 'Does this encode a complete URL?', answer: 'It uses component encoding. A complete URL has separate scheme, host, path, and query parts; encode individual values rather than encoding the whole address as one component.' },
      { question: 'Are spaces converted to plus signs?', answer: 'No. encodeURIComponent uses percent escapes such as %20, which is appropriate for a URL component. Form encoding has different rules and may represent spaces as plus signs.' },
      { question: 'Is URL encoding encryption?', answer: 'No. Percent-encoding is a transport representation, not a security control. Do not place confidential data in a URL merely because it has been encoded.' },
    ],
  },
  'xml-formatter': {
    title: 'XML Formatter and Validator',
    description: 'Check basic XML well-formedness and indent XML markup for readability using a local browser-side formatter.',
    introduction: [
      'XML stores structured data in nested elements and attributes. Consistent indentation makes configuration files, feeds, and API responses easier to inspect, while checking tag pairs helps catch common malformed-markup mistakes.',
      'This lightweight formatter checks tag nesting and basic markup structure, but it does not validate an XML document against a DTD, XSD, or application schema. It does not fetch external entities or transmit the document; use a schema-aware validator when conformance matters.',
    ],
    guidance: 'Paste a well-formed XML document and choose Format XML. If the tool reports an error, check matching start and end tags, comments, and entity references.',
    faqs: [
      { question: 'Does this validate against an XSD schema?', answer: 'No. It checks basic well-formedness such as tag nesting. Schema validation requires the applicable DTD, XSD, or other validation rules.' },
      { question: 'Why does it reject an XML document with matching tags?', answer: 'Unclosed comments, malformed markup, or invalid text outside tags can also make XML malformed. The message identifies common structural issues, but it is not a full XML parser diagnostic.' },
      { question: 'Are external XML resources loaded?', answer: 'No external document or schema is fetched by this formatter. The input is processed locally in the page.' },
    ],
  },
  'html-formatter': {
    title: 'HTML Formatter',
    description: 'Indent HTML markup into readable lines in your browser, with common void elements handled without closing tags.',
    introduction: [
      'Readable HTML helps when examining templates, copied snippets, and generated markup. This formatter separates tags and text onto lines and indents nested elements so a document’s structure is easier to scan.',
      'Browsers intentionally repair many HTML errors, and this simple formatter is not a standards validator or a DOM-preserving minifier. Review the output for inline elements and whitespace-sensitive content such as preformatted text before using it in production.',
    ],
    guidance: 'Paste HTML source and choose Format HTML. Review whitespace-sensitive sections and confirm the result in your own rendering or test environment.',
    faqs: [
      { question: 'Does this validate HTML against the standard?', answer: 'No. HTML is tolerant of malformed markup, and this formatter only adjusts line layout and indentation.' },
      { question: 'Can formatting change rendered text?', answer: 'Whitespace between some inline elements or within preformatted content can affect rendering. Inspect those areas and test the formatted markup before publishing it.' },
      { question: 'Is my markup uploaded?', answer: 'No. The formatter processes the text in your browser and does not send it to a formatting API.' },
    ],
  },
  'css-minifier': {
    title: 'CSS Minifier',
    description: 'Minify CSS by removing comments and unnecessary whitespace while preserving quoted text and checking balanced braces.',
    introduction: [
      'Minified CSS removes presentation whitespace and comments to reduce the size of stylesheet text. This tool is useful for quick inspection and prototyping; production pipelines should still use a tested build tool configured for the project’s CSS syntax.',
      'The minifier preserves whitespace inside quoted strings and checks for common structural errors such as unclosed comments, strings, and braces. It is not a complete CSS parser, so vendor extensions and advanced syntax should be tested in the browsers you support.',
    ],
    guidance: 'Paste a CSS stylesheet and select Minify CSS. Resolve reported structural errors, then compare the minified result with the original before deploying.',
    faqs: [
      { question: 'Does minification change CSS behavior?', answer: 'It is intended to remove comments and insignificant whitespace only, but this lightweight tool is not a full standards parser. Test the output, especially when using custom properties or unusual syntax.' },
      { question: 'Are comments removed?', answer: 'CSS comments outside quoted strings are removed. Text that resembles a comment inside a quoted string is preserved.' },
      { question: 'Can I use this instead of my production build step?', answer: 'Use your project’s established CSS build and test pipeline for production. This tool is intended for quick browser-side conversions and review.' },
    ],
  },
  'regex-tester': {
    title: 'Regular Expression Tester',
    description: 'Test JavaScript regular expression patterns against sample text, review match positions and capture groups, and catch invalid syntax.',
    introduction: [
      'Regular expressions are compact patterns for searching and matching text. A tester helps you try a pattern against representative input, select JavaScript flags, and inspect matched values, offsets, and capture groups before adding the expression to code.',
      'Patterns run in your browser using JavaScript RegExp. Complex patterns can take a long time on large input, so start with short sample text and avoid testing untrusted expressions in sensitive or shared environments. This tool does not rewrite, explain, or guarantee the performance of a pattern.',
    ],
    guidance: 'Enter a pattern without slash delimiters, choose supported JavaScript flags, and provide test text. Global or sticky mode lists multiple matches, up to a safe display limit.',
    faqs: [
      { question: 'Which regex flavor is supported?', answer: 'Patterns use the regular expression syntax implemented by the browser’s JavaScript engine, including JavaScript flags such as g, i, m, s, u, and y.' },
      { question: 'Why do I see only one match?', answer: 'Without the global or sticky flag, JavaScript returns only the first matching result. Enable g to find successive matches across the test text.' },
      { question: 'Can a regular expression be slow?', answer: 'Yes. Some patterns can exhibit excessive backtracking on certain inputs. Keep test strings small, use careful patterns, and consider time limits in applications that accept user-defined expressions.' },
    ],
  },
  'markdown-previewer': {
    title: 'Markdown Previewer',
    description: 'Preview common Markdown headings, lists, quotes, emphasis, and fenced code blocks with safe text rendering in your browser.',
    introduction: [
      'Markdown is a lightweight way to write documentation, notes, and issue descriptions using plain text conventions. A side-by-side preview makes it easier to check heading hierarchy, simple lists, emphasis, block quotes, and fenced code before sharing a document.',
      'The previewer supports a practical subset rather than every Markdown dialect. It renders user text as React text nodes instead of interpreting raw HTML, so pasted markup is displayed safely rather than executed as page content.',
    ],
    guidance: 'Write Markdown in the editor and review the live preview. Use # for headings, hyphens or numbers for list entries, > for quotes, and triple backticks for code blocks.',
    faqs: [
      { question: 'Which Markdown syntax is supported?', answer: 'The preview includes headings, one-line paragraphs, ordered and unordered list items, block quotes, inline code, bold, italics, and fenced code blocks.' },
      { question: 'Can Markdown render embedded HTML?', answer: 'Raw HTML is shown as text and is not executed. This avoids treating pasted markup as trusted page content.' },
      { question: 'Is there a download or save feature?', answer: 'The preview is kept in the current page state. Copy or save your source in your preferred editor; this tool does not persist it on a server.' },
    ],
  },
  'json-to-csv': {
    title: 'JSON to CSV Converter',
    description: 'Convert a JSON array of objects into CSV with a shared header row and correctly escaped commas, quotes, and line breaks.',
    introduction: [
      'CSV is a convenient interchange format for spreadsheet software and data pipelines. This converter accepts a JSON array of objects, creates a header from the object keys, and quotes field values that contain commas, quotation marks, or line breaks.',
      'Nested objects and arrays are represented as JSON text within a cell, and properties missing from a row produce an empty field. CSV has no native type system, so spreadsheet programs may interpret values such as long identifiers or formulas differently; review sensitive exports before opening them.',
    ],
    guidance: 'Paste a non-empty JSON array of objects and select Convert to CSV. The output uses the union of keys in first-seen order and escapes cell values according to common CSV rules.',
    faqs: [
      { question: 'What shape of JSON can be converted?', answer: 'Use a JSON array whose entries are objects, such as [{"name":"Ada"},{"name":"Lin"}]. A single object or an array of primitive values is not accepted.' },
      { question: 'How are nested properties converted?', answer: 'Nested arrays and objects are serialized as JSON text in the corresponding CSV cell. They are not expanded into additional columns.' },
      { question: 'How are quotes and commas handled?', answer: 'Cells containing a comma, quote, or line break are enclosed in double quotes, and embedded double quotes are doubled according to common CSV escaping rules.' },
    ],
  },
  'timestamp-converter': {
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix timestamps in seconds or milliseconds and date strings to UTC, local time, ISO format, and epoch values.',
    introduction: [
      'Unix timestamps count time from 1970-01-01T00:00:00Z. APIs and logs commonly report seconds or milliseconds, and confusing the two scales can move a date thousands of years away from its intended value.',
      'Enter a 10-digit seconds value, a 13-digit milliseconds value, or a date string understood by the browser. The output includes UTC and local representations; local display depends on the device time zone, so use the ISO or UTC value when sharing an unambiguous date.',
    ],
    guidance: 'Enter a Unix timestamp or an ISO-style date string. The converter detects seconds versus milliseconds by digit length and displays both UTC and device-local time.',
    faqs: [
      { question: 'How does the converter distinguish seconds from milliseconds?', answer: 'Integer timestamps with up to 10 digits (excluding a leading minus sign) are treated as seconds; longer integer values are treated as milliseconds.' },
      { question: 'Why does local time differ from UTC?', answer: 'Local display uses the time zone configured on your device and may include a daylight-saving offset. ISO and UTC output provide an unambiguous reference.' },
      { question: 'Which date string formats are supported?', answer: 'The browser Date parser handles common date strings. ISO 8601 strings with an explicit Z or numeric offset are recommended for predictable results.' },
    ],
  },
  'hash-generator': {
    title: 'SHA Hash Generator',
    description: 'Create SHA-1, SHA-256, SHA-384, or SHA-512 digests for text using the browser’s Web Crypto API.',
    introduction: [
      'A cryptographic hash maps input bytes to a fixed-size digest. Developers use hashes for checksums and integrity comparisons; this page uses Web Crypto to calculate SHA digests locally from UTF-8 text.',
      'A digest is not encryption and cannot be reversed to retrieve the original text. SHA-1 is included for compatibility but is not recommended for collision-resistant security decisions; choose SHA-256 or stronger for new integrity workflows and use a password-hashing algorithm for passwords.',
    ],
    guidance: 'Enter the text, select a SHA algorithm, and generate the digest. The output is hexadecimal; empty input is rejected to make accidental hashing explicit.',
    faqs: [
      { question: 'Does a hash encrypt my text?', answer: 'No. Hashing is a one-way digest operation, not encryption. It does not provide a way to recover the original input.' },
      { question: 'Which algorithm should I choose?', answer: 'SHA-256 is a widely supported general-purpose choice. SHA-384 and SHA-512 are also available; SHA-1 is provided for legacy compatibility and should not be used for security-sensitive collision resistance.' },
      { question: 'Should I use this to hash passwords?', answer: 'No. Password storage should use a dedicated, slow password-hashing algorithm such as Argon2id, scrypt, bcrypt, or PBKDF2 with a unique salt and appropriate parameters.' },
    ],
  },
  'diff-checker': {
    title: 'Text Diff Checker',
    description: 'Compare two text blocks line by line and identify unchanged, inserted, and removed lines locally.',
    introduction: [
      'A diff makes changes visible by comparing two versions of text. This line-based checker is helpful for reviewing small configuration edits, snippets, and notes without sending either version to a comparison service.',
      'The output preserves line order and marks additions and removals using a longest-common-subsequence comparison. Extremely large comparisons are capped to keep browser memory and processing bounded; for source-code reviews, prefer a version-control diff that also understands files and context.',
    ],
    guidance: 'Paste the original text on the left and the revised text on the right, then select Compare. Added lines are marked with +, removed lines with −, and unchanged lines with a space.',
    faqs: [
      { question: 'Does this compare text character by character?', answer: 'No. It compares complete lines and presents inserted, removed, and unchanged lines in order.' },
      { question: 'Why is there a size limit?', answer: 'The comparison uses a longest-common-subsequence matrix whose memory grows with both input lengths. A bounded input size helps keep the browser responsive.' },
      { question: 'Are blank lines significant?', answer: 'Yes. Line breaks and blank lines are part of the text and can appear as additions, removals, or unchanged lines in the comparison.' },
    ],
  },
}
