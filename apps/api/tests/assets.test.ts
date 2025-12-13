import { describe, expect, test, beforeEach } from '@jest/globals';
import request from "supertest";
import fs from "fs";
import _ from "lodash";

import app from "../src/index";
import { assets } from "../src/services/db";
import { assetPayload, fullAsset } from "./data/assets";

describe('Assets endpoints', () => {
    beforeEach(() => {
        assets.length = 0;
    });

    test('GET /assets responds with 200 and json array', async () => {
        const response = await request(app).get('/assets');
        expect(response.status).toBe(200);
        const data = response.body;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toEqual(0);
    });

    test('POST /assets with valid data responds with 201 and created asset', async () => {
        const thumbnail = fs.readFileSync("tests/files/cross.png")

        const response = await request(app)
            .post('/assets')
            .field("name", assetPayload.name)
            .field("video", assetPayload.video)
            .field("description", assetPayload.description)
            .field("type", assetPayload.type)
            .field("durationSec", assetPayload.durationSec.toString())
            .field("nbUav", assetPayload.nbUav.toString())
            .field("tags[]", assetPayload.tags[0])
            .field("tags[]", assetPayload.tags[1])
            .attach("thumbnail", thumbnail, "cross.png")

        expect(response.status).toBe(201);
        expect(_.omit(
            response.body,
            ['id', 'createdAt', 'thumbnail']))
            .toEqual(assetPayload);
    });

    test('PATCH /assets/:id with valid data responds with 200 and updated asset', async () => {
        assets.push(fullAsset);

        const updateData = {
            name: "Updated Asset",
            description: "Updated description"
        };

        const response = await request(app)
            .patch(`/assets/${fullAsset.id}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            ...fullAsset,
            ...updateData
        });
    });

    test('GET /assets/thumbnail/:id responds with 200 and image buffer', async () => {
        const thumbnail = fs.readFileSync("tests/files/cross.png")

        const postResponse = await request(app)
            .post('/assets')
            .field("name", assetPayload.name)
            .field("video", assetPayload.video)
            .field("description", assetPayload.description)
            .field("type", assetPayload.type)
            .field("durationSec", assetPayload.durationSec.toString())
            .field("nbUav", assetPayload.nbUav.toString())
            .field("tags[]", assetPayload.tags[0])
            .field("tags[]", assetPayload.tags[1])
            .attach("thumbnail", thumbnail, "cross.png");

        expect(postResponse.status).toBe(201);
        const createdAsset = postResponse.body;

        const getResponse = await request(app)
            .get(`/assets/thumbnail/${createdAsset.thumbnail}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toBeInstanceOf(Buffer);
        expect(getResponse.body.length).toBeGreaterThan(0);
    });

    test('DELETE /assets/:id responds with 204 and removes the asset', async () => {
        assets.push(fullAsset);

        const response = await request(app)
            .delete(`/assets/${fullAsset.id}`);

        expect(response.status).toBe(204);
        expect(assets.length).toBe(0);
    });

    describe('Invalid requests', () => {
        test('POST /assets without thumbnail responds with 400', async () => {
            const response = await request(app)
                .post('/assets')
                .field("name", assetPayload.name)
                .field("video", assetPayload.video)
                .field("description", assetPayload.description)
                .field("type", assetPayload.type)
                .field("durationSec", assetPayload.durationSec.toString())
                .field("nbUav", assetPayload.nbUav.toString())
                .field("tags[]", assetPayload.tags[0])
                .field("tags[]", assetPayload.tags[1]);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'validation');
            expect(response.body).toHaveProperty('message', 'Thumbnail is required');
        });

        test('POST /assets with missing required fields responds with 400', async () => {
            const thumbnail = fs.readFileSync("tests/files/cross.png");

            const response = await request(app)
                .post('/assets')
                .field("name", assetPayload.name)
                .attach("thumbnail", thumbnail, "cross.png");

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'validation');
            expect(response.body).toHaveProperty('issues');
        });

        test('POST /assets with duplicate tags responds with 400', async () => {
            const thumbnail = fs.readFileSync("tests/files/cross.png");

            const response = await request(app)
                .post('/assets')
                .field("name", assetPayload.name)
                .field("video", assetPayload.video)
                .field("description", assetPayload.description)
                .field("type", assetPayload.type)
                .field("durationSec", assetPayload.durationSec.toString())
                .field("nbUav", assetPayload.nbUav.toString())
                .field("tags[]", "duplicate")
                .field("tags[]", "duplicate")
                .attach("thumbnail", thumbnail, "cross.png");

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'validation');
            expect(response.body).toHaveProperty('message', 'Asset tags must be unique');
        });

        test('PATCH /assets/:id with invalid id responds with 400', async () => {
            const updateData = {
                name: "Updated Asset"
            };

            const response = await request(app)
                .patch('/assets/invalid-id')
                .send(updateData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'invalid id');
        });

        test('PATCH /assets/:id with non-existent id responds with 404', async () => {
            const updateData = {
                name: "Updated Asset"
            };

            const response = await request(app)
                .patch(`/assets/${crypto.randomUUID()}`)
                .send(updateData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'not found');
        });

        test('PATCH /assets/:id with duplicate tags responds with 400', async () => {
            assets.push(fullAsset);

            const updateData = {
                tags: ["duplicate", "duplicate"]
            };

            const response = await request(app)
                .patch(`/assets/${fullAsset.id}`)
                .send(updateData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'validation');
            expect(response.body).toHaveProperty('message', 'Asset tags must be unique');
        });

        test('GET /assets/thumbnail/:id with invalid id responds with 400', async () => {
            const response = await request(app)
                .get('/assets/thumbnail/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'invalid id');
        });

        test('GET /assets/thumbnail/:id with non-existent id responds with 404', async () => {
            const response = await request(app)
                .get(`/assets/thumbnail/${crypto.randomUUID()}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'not found');
        });

        test('DELETE /assets/:id with invalid id responds with 400', async () => {
            const response = await request(app)
                .delete('/assets/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'invalid id');
        });

        test('DELETE /assets/:id with non-existent id responds with 404', async () => {
            const response = await request(app)
                .delete(`/assets/${crypto.randomUUID()}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'not found');
        });
    });
});