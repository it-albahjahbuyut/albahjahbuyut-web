import { db } from '../src/lib/db';

async function checkDuplicates() {
    console.log('=== Checking for duplicates ===\n');

    // Check Unit duplicates
    const units = await db.unit.findMany({ orderBy: { name: 'asc' } });
    console.log('Units:', units.length);
    units.forEach(u => console.log(`  - ${u.name} (${u.slug})`));
    const unitNames = units.map(u => u.name);
    const duplicateUnits = unitNames.filter((name, i) => unitNames.indexOf(name) !== i);
    if (duplicateUnits.length > 0) {
        console.log('  ⚠️ Duplicate units:', duplicateUnits);
    } else {
        console.log('  ✅ No duplicate units');
    }

    // Check Gallery duplicates (same title)
    const galleries = await db.gallery.findMany({ orderBy: { title: 'asc' } });
    console.log('\nGalleries:', galleries.length);
    const galleryTitles = galleries.map(g => g.title);
    const duplicateGalleries = galleryTitles.filter((title, i) => galleryTitles.indexOf(title) !== i);
    if (duplicateGalleries.length > 0) {
        console.log('  ⚠️ Duplicate galleries:', duplicateGalleries);
    } else {
        console.log('  ✅ No duplicate galleries');
    }

    // Check PSB Documents duplicates (same registration + documentType)
    const psbDocs = await db.pSBDocument.findMany({
        include: { registration: { select: { registrationNumber: true } } }
    });
    console.log('\nPSB Documents:', psbDocs.length);
    const docKeys = psbDocs.map(d => `${d.registrationId}-${d.documentType}`);
    const duplicateDocs = docKeys.filter((key, i) => docKeys.indexOf(key) !== i);
    if (duplicateDocs.length > 0) {
        console.log('  ⚠️ Duplicate PSB documents:', duplicateDocs.length);
        const uniqueDups = [...new Set(duplicateDocs)];
        console.log('  Unique duplicate keys:', uniqueDups);
    } else {
        console.log('  ✅ No duplicate PSB documents');
    }

    // Check PSB Registrations
    const psbRegs = await db.pSBRegistration.findMany({
        include: { unit: { select: { name: true } } }
    });
    console.log('\nPSB Registrations:', psbRegs.length);
    psbRegs.forEach(r => console.log(`  - ${r.registrationNumber}: ${r.namaLengkap} (${r.unit.name})`));

    // Check Posts
    const posts = await db.post.findMany({ orderBy: { title: 'asc' } });
    console.log('\nPosts:', posts.length);
    const postSlugs = posts.map(p => p.slug);
    const duplicatePosts = postSlugs.filter((slug, i) => postSlugs.indexOf(slug) !== i);
    if (duplicatePosts.length > 0) {
        console.log('  ⚠️ Duplicate post slugs:', duplicatePosts);
    } else {
        console.log('  ✅ No duplicate posts');
    }

    // Check Donations
    const donations = await db.donationProgram.findMany({ orderBy: { title: 'asc' } });
    console.log('\nDonation Programs:', donations.length);
    const donationTitles = donations.map(d => d.title);
    const duplicateDonations = donationTitles.filter((title, i) => donationTitles.indexOf(title) !== i);
    if (duplicateDonations.length > 0) {
        console.log('  ⚠️ Duplicate donation programs:', duplicateDonations);
    } else {
        console.log('  ✅ No duplicate donation programs');
    }

    await db.$disconnect();
    console.log('\n=== Check complete ===');
}

checkDuplicates().catch(console.error);
