import { describe, expect, test } from '@jest/globals';
import request from "supertest";

import { prismaMock } from "./setup/prisma.mock.js";
import app from "../src/index.js";

describe('Users endpoints', () => {
    describe('GET /users', () => {
        test('responds with 200 and list of users with highscores', async () => {
            const mockUsers = [
                {
                    nickname: 'User1',
                    _count: { combinations: 5 }
                },
                {
                    nickname: 'User2',
                    _count: { combinations: 10 }
                }
            ];

            prismaMock.user.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce(mockUsers);

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { nickname: 'User1', nbCombinationsFound: 5 },
                { nickname: 'User2', nbCombinationsFound: 10 }
            ]);
        });

        test('responds with 200 and empty list when no users', async () => {
            prismaMock.user.findMany.calledWith(expect.any(Object) as any).mockResolvedValueOnce([]);

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
