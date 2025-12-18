import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient, AssetType, type Asset as AssetModel, AssetName, Sound } from '../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
console.log("Connecting to database with connection string:", connectionString)

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma, AssetType, type AssetModel, AssetName, Sound }