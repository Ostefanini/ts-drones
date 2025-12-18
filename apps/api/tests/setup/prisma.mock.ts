// tests/setup/prisma.mock.ts
import { jest, beforeEach } from '@jest/globals';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { type PrismaClient, AssetType as AssetTypeGenerated } from '../../src/generated/prisma/client.js'

jest.unstable_mockModule('../../src/services/prisma.js', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
    AssetType: AssetTypeGenerated
}))

const { prisma } = await import('../../src/services/prisma.js')

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
    mockReset(prismaMock)
})
