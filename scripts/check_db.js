const { MongoClient } = require('mongodb');

async function checkDB() {
    const client = new MongoClient('mongodb://mongo:bIrcHoNjCwAcrLfwkpavcPUzxqYyVBVo@turntable.proxy.rlwy.net:35396');
    await client.connect();
    const db = client.db('pharmacydb');
    
    // Find medicines with ONLY paracetamol (single salt)
    const paracetamolOnly = await db.collection('medicines').find({
        salts: { $size: 1 },
        'salts.0': { $regex: 'paracetamol', $options: 'i' }
    }).limit(10).toArray();
    
    console.log('Medicines with ONLY paracetamol (single salt):');
    paracetamolOnly.forEach(m => {
        console.log(`  - ${m.name} | Salts: ${m.salts} | Price: ${m.price}`);
    });
    
    // Count single-salt paracetamol medicines
    const count = await db.collection('medicines').countDocuments({
        salts: { $size: 1 },
        'salts.0': { $regex: 'paracetamol', $options: 'i' }
    });
    console.log('\nTotal single-salt paracetamol medicines:', count);
    
    await client.close();
}

checkDB();
