const sdk = require('node-appwrite');

async function main() {
    const client = new sdk.Client()
        .setEndpoint('https://sgp.cloud.appwrite.io/v1') // Your API Endpoint
        .setProject('699766f5001fb64fb9d8') // Your project ID
        .setKey(process.env.APPWRITE_API_KEY || 'standard_a3eaf6fe38006816bc1d65a3ee5a402d127c1e7f3dbaf18cc576cd06fd08ea10d68d255909860e5e9c3b244c36d94879b8816192aaf22208215fae728a113c5af8e0f4472ed667fb9f9efc39bbb3eeea454d8a85ea3fcd43a4e6848322d7d76d5716287d2f4bea7eb775d44244204621b3b7682765cbf09f3ff82443b6301546'); // Your secret API key

    const databases = new sdk.Databases(client);

    try {
        const response = await databases.listCollections('699767ef000c770755e3');
        console.log("Collections in DB (699767ef000c770755e3):");
        response.collections.forEach(col => {
            console.log(`- Name: ${col.name} | ID: ${col.$id}`);
        });
    } catch (error) {
        console.error("Error fetching collections:", error);
    }
}

main();
