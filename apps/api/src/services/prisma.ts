import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient, AssetType, type Asset as AssetModel } from '../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma, AssetType, type AssetModel }