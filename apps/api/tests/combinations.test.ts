import { describe, expect, test } from '@jest/globals';
import request from "supertest";

import { prismaMock } from "./setup/prisma.mock.js";
import app from "../src/index.js";
import { AssetName, Sound } from "../src/services/prisma.js";

describe('Combinations endpoints', () => {
    const validAssets = [
        { id: '1', name: AssetName.TRIANGLE },
        { id: '2', name: AssetName.SQUARE }
    ];

    const validCombination = {
        id: 'comb1',
        assetOne: AssetName.TRIANGLE,
        assetTwo: AssetName.SQUARE,
        assetThree: null,
        assetFour: null,
        sound: Sound.NONE,
        foundById: 'user1',
        foundBy: {
            nickname: 'TestUser'
        }
    };

    describe('GET /combinations/is-found', () => {
        test('responds with 200 and exist: true when combination exists', async () => {
            prismaMock.asset.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validAssets as any);
            prismaMock.combination.findFirst.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validCombination as any);

            const response = await request(app)
                .get('/combinations/is-found')
                .query({
                    assetOne: AssetName.TRIANGLE,
                    assetTwo: AssetName.SQUARE,
                    sound: 'none'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                exist: true,
                foundBy: 'TestUser'
            });
        });

        test('responds with 200 and exist: false when combination does not exist', async () => {
            prismaMock.asset.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validAssets as any);
            prismaMock.combination.findFirst.calledWith(expect.any(Object) as any).mockResolvedValueOnce(null);

            const response = await request(app)
                .get('/combinations/is-found')
                .query({
                    assetOne: AssetName.TRIANGLE,
                    assetTwo: AssetName.SQUARE,
                    sound: 'none'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                exist: false,
                foundBy: null
            });
        });

        test('responds with 400 when query parameters are invalid (missing assetOne)', async () => {
            const response = await request(app)
                .get('/combinations/is-found')
                .query({
                    assetTwo: AssetName.SQUARE,
                    sound: 'none'
                });

            expect(response.status).toBe(400);
        });

        test('responds with 400 when assets have gaps', async () => {
            const response = await request(app)
                .get('/combinations/is-found')
                .query({
                    assetOne: AssetName.TRIANGLE,
                    sound: 'none',
                    assetThree: AssetName.SQUARE
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Assets must be provided in order without gaps');
        });

        test('responds with 404 when assets do not exist in DB', async () => {
            prismaMock.asset.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce([]);

            const response = await request(app)
                .get('/combinations/is-found')
                .query({
                    sound: 'none',
                    assetOne: AssetName.TRIANGLE
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'One or more assets do not exist in the database');
        });
    });

    describe('POST /combinations/attribute', () => {
        test('responds with 201 when creating a new combination', async () => {
            prismaMock.asset.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validAssets as any);
            prismaMock.combination.findFirst.calledWith(expect.any(Object) as any).mockResolvedValueOnce(null);
            prismaMock.combination.create.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validCombination as any);

            const response = await request(app)
                .post('/combinations/attribute')
                .query({
                    assetOne: AssetName.TRIANGLE,
                    assetTwo: AssetName.SQUARE,
                    sound: 'none'
                })
                .send({
                    userNickname: 'NewUser'
                });

            expect(response.status).toBe(201);
        });

        test('responds with 400 when combination already exists', async () => {
            prismaMock.asset.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validAssets as any);
            prismaMock.combination.findFirst.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validCombination as any);

            const response = await request(app)
                .post('/combinations/attribute')
                .query({
                    assetOne: AssetName.TRIANGLE,
                    assetTwo: AssetName.SQUARE,
                    sound: 'none',
                })
                .send({
                    userNickname: 'NewUser'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Combination already exists');
        });

        test('responds with 400 when nickname is invalid', async () => {
            prismaMock.asset.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validAssets as any);
            prismaMock.combination.findFirst.calledWith(expect.any(Object) as any).mockResolvedValueOnce(null);

            const response = await request(app)
                .post('/combinations/attribute')
                .query({
                    assetOne: AssetName.TRIANGLE,
                    sound: 'none',
                    assetTwo: AssetName.SQUARE
                })
                .send({
                    userNickname: '' // Too short
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid nickname');
        });

        test('responds with 400 when nickname is profane', async () => {
            prismaMock.asset.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce(validAssets as any);
            prismaMock.combination.findFirst.calledWith(expect.any(Object) as any).mockResolvedValueOnce(null);

            const response = await request(app)
                .post('/combinations/attribute')
                .query({
                    assetOne: AssetName.TRIANGLE,
                    sound: 'none',
                    assetTwo: AssetName.SQUARE
                })
                .send({
                    userNickname: 'fuck' // Profane
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Nickname contains inappropriate language');
        });
    });
});
