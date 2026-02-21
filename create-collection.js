const sdk = require('node-appwrite');

async function main() {
    const client = new sdk.Client()
        .setEndpoint('https://sgp.cloud.appwrite.io/v1')
        .setProject('699766f5001fb64fb9d8')
        .setKey(process.env.APPWRITE_API_KEY || 'standard_a3eaf6fe38006816bc1d65a3ee5a402d127c1e7f3dbaf18cc576cd06fd08ea10d68d255909860e5e9c3b244c36d94879b8816192aaf22208215fae728a113c5af8e0f4472ed667fb9f9efc39bbb3eeea454d8a85ea3fcd43a4e6848322d7d76d5716287d2f4bea7eb775d44244204621b3b7682765cbf09f3ff82443b6301546');

    const databases = new sdk.Databases(client);
    const databaseId = '699767ef000c770755e3';
    const collectionId = 'prescriptions';

    const attributes = [
        () => databases.createUrlAttribute(databaseId, collectionId, 'imageUrl', true),
        () => databases.createStringAttribute(databaseId, collectionId, 'rawText', 50000, true),
        () => databases.createStringAttribute(databaseId, collectionId, 'parsedMedicines', 100000, true),
        () => databases.createFloatAttribute(databaseId, collectionId, 'ocrConfidence', true),
        () => databases.createDatetimeAttribute(databaseId, collectionId, 'createdAt', true),
        () => databases.createBooleanAttribute(databaseId, collectionId, 'pharmacistReviewed', true),
        () => databases.createStringAttribute(databaseId, collectionId, 'corrections', 100000, false),
        () => databases.createStringAttribute(databaseId, collectionId, 'patientInfo', 100000, false)
    ];

    console.log("Creating attributes individually...");

    for (const attr of attributes) {
        try {
            await attr();
            console.log("Created an attribute successfully.");
        } catch (error) {
            if (error.code === 409) {
                console.log("Attribute already exists.");
            } else {
                console.error("Error creating attribute:", error.message);
            }
        }
    }

    console.log("✅ All attributes processed! You can now use the OCR feature.");
}

main();
