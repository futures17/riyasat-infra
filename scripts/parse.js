import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function parse() {
    const filePath = path.join(__dirname, '..', 'daily motivation', 'DailySuvichar_Final.txt');
    const rawText = fs.readFileSync(filePath, 'utf-8');
    
    // Replace unusual separators
    let text = rawText.replace(/\n/g, ' ');
    
    // Split by Danda, or quotes ending with dot
    // A quote is generally a sentence ending in , ।, or .” 
    // Sometimes followed by ~ Author.
    // Let's split by " ~ " to see if we can extract quotes with authors, OR we can just split by danda/dot.
    let possibleQuotes = text.split(/(?<=[।।”])/g);
    
    let quotes = [];
    let idCounter = 1;
    let currentSentence = "";
    
    for (let part of possibleQuotes) {
        // Clean up leading/trailing spaces and garbage
        part = part.trim();
        
        // Remove author attributions if they fell into the beginning of the next part
        part = part.replace(/^~[^\।\.”]+/, '').trim();
        part = part.replace(/^[a-zA-Z\s\(\)]+/, '').trim(); // Remove english names
        part = part.replace(/अन्य\s+.*?\s+सुविचार/, '').trim(); // Remove "अन्य महात्मा गांधी सुविचार"
        
        currentSentence += " " + part;
        currentSentence = currentSentence.trim();
        
        // If the current sentence is long enough and ends with punctuation
        if (currentSentence.length > 20 && /[।।”]$/.test(currentSentence)) {
            // Further clean
            let cleanText = currentSentence.replace(/^[\d\.\s]+/, ''); // remove numbering
            cleanText = cleanText.replace(/~.*$/, '').trim(); // Remove author at the end if inside
            if (cleanText.length > 15) {
                quotes.push({
                    id: idCounter++,
                    text: cleanText
                });
            }
            currentSentence = "";
        }
    }
    
    // If still not enough quotes, let's try a different regex, matching text enclosed in “ ” or ending in ।
    if (quotes.length < 500) {
        console.log("Fallback parsing...");
        const matches = rawText.match(/(?:“[^”]+”)|(?:[^।]+।)/g);
        if (matches) {
            quotes = matches.map(m => {
                let text = m.replace(/^[\d\.\s]+/, '').replace(/~.*$/, '').trim();
                return text;
            }).filter(t => t.length > 15).map((t, i) => ({ id: i + 1, text: t }));
        }
    }

    const dest = path.join(__dirname, '..', 'src', 'data', 'quotes.json');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    
    // ensure all quotes have unique ids and valid text
    const finalQuotes = quotes.filter(q => q.text).map((q, i) => ({ id: i + 1, text: q.text }));
    
    fs.writeFileSync(dest, JSON.stringify(finalQuotes, null, 2));
    console.log(`Parsed ${finalQuotes.length} quotes and saved to ${dest}`);
}

parse();
