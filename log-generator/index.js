const axios = require('axios');
const faker = require('faker');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

let logFileStream;

function createNewLogFile() {
    const date = new Date();
    const logFileName = `log-${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}-${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}.log`;
    const logFile = path.join(logDir, logFileName);

    if (logFileStream) {
        logFileStream.end();
    }

    logFileStream = fs.createWriteStream(logFile, {flags: 'a'});
}

createNewLogFile();
setInterval(createNewLogFile, 60 * 1000);

function generateLog() {
    const logTypes = ['INFO', 'ERROR', 'WARN', 'DEBUG'];
    const logType = logTypes[Math.floor(Math.random() * logTypes.length)];

    const logEntry = {
        timestamp: new Date().toISOString(),
        level: logType,
        message: faker.lorem.sentence(),
        user: {
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            email: faker.internet.email(),
            ip: faker.internet.ip(),
            location: {
                latitude: faker.address.latitude(),
                longitude: faker.address.longitude(),
            },
        },
        request: {
            method: faker.random.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
            url: faker.internet.url(),
            status: faker.random.arrayElement([200, 201, 400, 404, 500]),
            responseTime: faker.datatype.number({min: 20, max: 3000}),
            userAgent: faker.internet.userAgent(),
            headers: {
                host: faker.internet.domainName(),
                connection: faker.random.arrayElement(['keep-alive', 'close']),
                'content-type': faker.random.arrayElement(['application/json', 'text/html', 'application/xml']),
            },
        },
        system: {
            cpuUsage: faker.datatype.float({min: 0, max: 100}),
            memoryUsage: faker.datatype.number({min: 100, max: 16000}),
            diskUsage: faker.datatype.number({min: 100, max: 102400}),
        },
    };

    return JSON.stringify(logEntry);
}

function writeLogToFile(logEntry) {
    logFileStream.write(logEntry + '\n', err => {
        if (err) {
            console.error('Log file stream error:', err);
        }
    });
    console.log('Written log entry:', logEntry);
}

async function sendLogToLogstash(logEntry) {
    try {
        await axios.post('http://logstash:5004', logEntry, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Sent log entry to Logstash:', logEntry);
    } catch (err) {
        console.error('Logstash connection error:', err);
    }
}

function main() {
    setInterval(async () => {
        const logEntry = generateLog();
        writeLogToFile(logEntry);
        await sendLogToLogstash(logEntry);
    }, 5000);
}

main();
