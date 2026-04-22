import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function decodeEntities(text) {
    return text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
               .replace(/&nbsp;/g, ' ')
               .replace(/&quot;/g, '"')
               .replace(/&ldquo;/g, '“')
               .replace(/&rdquo;/g, '”')
               .replace(/&amp;/g, '&');
}

const AUTHORS = [
    'महात्मा गांधी', 'स्वामी विवेकानंद', 'अल्बर्ट आइंस्टीन', 'अल्बर्ट आईन्सटीन', 'अल्बर्ट आइंस्टाइन',
    'जॉर्ज बर्नार्ड शॉ', 'अब्राहम लिंकन', 'अरस्तू', 'मार्टिन लूथर किंग', 'विल्सन चर्चिल',
    'शेक्सपियर', 'हेनरी वार्ड बीचर', 'राल्फ वाल्डो इमर्सन', 'दलाई लामा', 'मार्क ट्वेन',
    'गोएथे', 'कंफ्यूशियस', 'विल्सन', 'रविंद्रनाथ टैगोर', 'ओशो', 'गौतम बुद्ध', 'चाणक्य',
    'भगत सिंह', 'सुभाष चंद्र बोस', 'एपीजे अब्दुल कलाम', 'नरेंद्र मोदी', 'एडिथ व्हॉर्टन',
    'जोहान वोल्फगैंग गोएथे', 'बेंजामिन फ्रैंकलिन'
];

async function formatHtml() {
    const backupPath = path.join(__dirname, '..', 'daily motivation', 'DailySuvichar_backup.html');
    const filePath = path.join(__dirname, '..', 'daily motivation', 'DailySuvichar.html');
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'quotes.json');
    
    if (!fs.existsSync(backupPath)) {
        console.error("Backup file not found!");
        return;
    }

    let htmlContent = fs.readFileSync(backupPath, 'utf-8');

    // 1. Strip structural HTML
    htmlContent = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    htmlContent = htmlContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    let rawText = htmlContent.replace(/<[^>]*>/g, ' ');
    
    // 2. Decode and base normalization
    rawText = decodeEntities(rawText);
    rawText = rawText.replace(/\s+/g, ' ').trim();

    // 3. Aggressive Metadata cleaning
    // Remove anything in parentheses (English translations, SEO keywords)
    rawText = rawText.replace(/\(.*?\)/g, ' ');
    
    const noisePhrases = [
        /Aaj ka Suvichar in Hindi/gi, /Vichar in Hindi/gi, /SadVichar/gi, /Suvichar Status/gi,
        /सुविचार स्टेटस/g, /अच्छे विचार/g, /शुभ विचार/g, /इन हिंदी/g, /अनमोल वचन/g,
        /Inspirational money making quotes/gi, /Copyright ©/gi, /मेहनत और धैर्य की ताकत/g,
        /अन्य.*?सुविचार/g, /range \d+-\d+/gi, /\d{1,3}-\d{1,3}:/g
    ];

    noisePhrases.forEach(regex => {
        rawText = rawText.replace(regex, ' ');
    });

    // 4. Multi-Stage Expert Splitting
    const SPLIT_MARKER = '###SPLIT###';
    
    // Rule A: Split on terminators (। | ! ? .) immediately, even if no space follows
    let processed = rawText.replace(/([।|!\?\.])(?!\d)/g, `$1${SPLIT_MARKER}`);
    
    // Rule B: Split before known author patterns or attribution markers
    processed = processed.replace(/\s*(~|—| - )\s*/g, `${SPLIT_MARKER}$1 `);

    // Rule C: Split if an author name appears suddenly (acting as a header)
    AUTHORS.forEach(name => {
        const regex = new RegExp(`(${name})`, 'g');
        processed = processed.replace(regex, `${SPLIT_MARKER}$1${SPLIT_MARKER}`);
    });

    let fragments = processed.split(SPLIT_MARKER);
    let masterList = [];

    fragments.forEach(frag => {
        let clean = frag.trim();
        
        // Remove leading junk (including quotes and separators)
        clean = clean.replace(/^[>\s\d\.\-~|।:“”‘’"']+/, '');
        // Remove trailing junk
        clean = clean.replace(/[\s\d\.\-~|।:“”‘’"']+$/, '');

        // skip if too short or just an author name
        if (clean.length < 15) return;
        
        // Skip if the segment IS exactly an author name (case insensitive/trimmed)
        if (AUTHORS.some(name => name === clean || clean.includes(name) && clean.length < name.length + 5)) return;

        // Final cleaning of multiple spaces
        clean = clean.replace(/\s+/g, ' ');

        // Deduplication
        if (masterList.includes(clean)) return;

        masterList.push(clean);
    });

    // 5. Generate Outputs
    const finalData = masterList.map((text, i) => ({ id: i + 1, text }));
    fs.writeFileSync(jsonPath, JSON.stringify(finalData, null, 2), 'utf-8');

    // Generate HTML for preview
    let grids = masterList.map((q, i) => `
        <div class="card">
            <span class="num">${i + 1}.</span>
            <p class="txt">${q}</p>
        </div>`).join('');

    const htmlDoc = `
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8"><title>Expert Cleaned Suvichar</title>
    <style>
        body { background: #0b1512; color: #f5e6ca; font-family: system-ui; padding: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.1); padding: 20px; border-radius: 12px; }
        .num { font-weight: 900; color: #d4af37; font-size: 0.8rem; opacity: 0.5; }
        .txt { line-height: 1.6; font-size: 1rem; margin-top: 5px; }
    </style>
</head>
<body>
    <h1>Stable Suvichar List (${masterList.length})</h1>
    <div class="grid">${grids}</div>
</body>
</html>`;

    fs.writeFileSync(filePath, htmlDoc, 'utf-8');
    console.log(`Expert Overhaul Complete: ${masterList.length} high-quality thoughts extracted.`);
}

formatHtml().catch(console.error);
