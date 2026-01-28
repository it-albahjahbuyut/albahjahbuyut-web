// Compare PAUD vs STANDARD form fields
import { PAUD_FORM_FIELDS, STANDARD_FORM_FIELDS, SMP_DOCUMENTS, SMA_DOCUMENTS, PAUD_DOCUMENTS } from '../src/lib/psb-config';

console.log('='.repeat(60));
console.log('COMPARISON: PAUD vs STANDARD (SMP/SMA) FORMS');
console.log('='.repeat(60));

// Get field names
const paudFields = new Set(PAUD_FORM_FIELDS.map(f => f.name));
const standardFields = new Set(STANDARD_FORM_FIELDS.map(f => f.name));

// Fields ONLY in PAUD (not in Standard)
console.log('\n📋 FIELDS ONLY IN PAUD (not in SMP/SMA):');
const paudOnly = [...paudFields].filter(f => !standardFields.has(f));
paudOnly.forEach(f => console.log('  ✅', f));

// Fields in Standard but NOT in PAUD
console.log('\n📋 FIELDS IN SMP/SMA BUT NOT IN PAUD:');
const standardOnly = [...standardFields].filter(f => !paudFields.has(f));
standardOnly.forEach(f => console.log('  ⚪', f));

// Check required status
console.log('\n⚠️  VALIDATION FIELD CHECK:');
console.log('-'.repeat(40));
console.log('Fields in SMP/SMA but NOT in PAUD - should be OPTIONAL in schema:');
const criticalFields = ['nisn', 'nik', 'noKK', 'asalSekolah', 'jumlahTanggungan', 'grade', 'jenisSantri'];
criticalFields.forEach(field => {
    const inPaud = paudFields.has(field);
    const inStandard = standardFields.has(field);
    if (inStandard && !inPaud) {
        console.log(`  ⚠️  ${field}: In Standard, NOT in PAUD - MUST be optional in schema`);
    } else if (inStandard && inPaud) {
        console.log(`  ✅ ${field}: In both`);
    }
});

// Summary
console.log('\n📊 SUMMARY:');
console.log('-'.repeat(40));
console.log(`PAUD: ${PAUD_FORM_FIELDS.length} fields, ${PAUD_FORM_FIELDS.filter(f => f.required).length} required`);
console.log(`Standard (SMP/SMA): ${STANDARD_FORM_FIELDS.length} fields, ${STANDARD_FORM_FIELDS.filter(f => f.required).length} required`);
console.log(`\nPAUD Documents: ${PAUD_DOCUMENTS.length}`);
console.log(`SMP Documents: ${SMP_DOCUMENTS.length}`);
console.log(`SMA Documents: ${SMA_DOCUMENTS.length}`);

console.log('\n' + '='.repeat(60));
