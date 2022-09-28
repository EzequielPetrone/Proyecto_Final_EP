import 'dotenv/config' // Para poder usar las variables de entorno directamente.

// Importo y utilizo YARGS
import yargsF from 'yargs/yargs';
const yargs = yargsF(process.argv.slice(2))

const argv = yargs.alias({ p: "port", m: "mode" }).alias({ p: "puerto", m: "modo" }).default({ p: 8080, m: "FORK" }).argv;

import os from 'os'
const numCPUs = os.cpus().length // Calculo qty de núcleos del proc

const MONGO_URL = process.env.MONGO_URL || ''
const PORT = process.env.PORT || parseInt(argv.port)
const MODE = process.env.MODE || argv.mode
const EXP_TIME = parseInt(process.env.EXP_TIME) || (1000 * 60 * 10)
const NUMCPUS = numCPUs || 1
const PASSPORT_SESSION_SECRET = process.env.PASSPORT_SESSION_SECRET || 'PASSPORT_SESSION_SECRET'

const TIPO_PERSISTENCIA = process.env.TIPO_PERSISTENCIA || 'MONGO'

const MAIL_ADMIN = 'administrador@esdpstore.com'
const PHONE_NUMBER_ADMIN = '+5491162395265'

export { MONGO_URL, PORT, MODE, EXP_TIME, NUMCPUS, PASSPORT_SESSION_SECRET, TIPO_PERSISTENCIA, MAIL_ADMIN, PHONE_NUMBER_ADMIN }