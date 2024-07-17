const faker = require('faker');
const fs = require('fs');
const path = require('path');
const kafka = require('kafka-node');

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

async function sendLogToKafka(logEntry) {
    const client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});
    const producer = new kafka.Producer(client);
    const payloads = [{ topic: 'log-topic', messages: logEntry, partition: 0 }];

    producer.on('ready', () => {
        producer.send(payloads, (err, data) => {
            if (err) console.error('Kafka connection error:', err);
            else console.log('Sent log entry to Kafka:', logEntry);
        });
    });

    producer.on('error', err => {
        console.error('Kafka producer error:', err);
    });
}

function main() {
    setInterval(async () => {
        const logEntry = generateLog();
        writeLogToFile(logEntry);
        await sendLogToKafka(logEntry);
    }, 2000);
}

main();
