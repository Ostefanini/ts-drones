import { beforeEach, describe, expect, test } from '@jest/globals';
import request from "supertest";
import _ from 'lodash';

import { assets } from "../src/services/db";
import app from "../src/index";
import { fullAsset } from './data/assets';

describe('Tags endpoints', () => {
    beforeEach(() => {
        assets.length = 0;
    });

    test('GET /tags responds with 200 and json array', async () => {
        assets.push(fullAsset);

        const response = await request(app).get('/tags');
        expect(response.status).toBe(200);
        const data = response.body;
        expect(_.isEqual(data, fullAsset.tags)).toBe(true);
    });
});