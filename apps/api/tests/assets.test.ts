import { describe, expect, test } from '@jest/globals';
import request from "supertest";
import fs from "fs";
import _ from "lodash";

import { prismaMock } from "./setup/prisma.mock.js";
import app from "../src/index";
import { assetPayload, fullAsset, fullAssetFromDb } from "./data/assets.js";
import { formatAssetName } from "../src/helpers/formatters.js";

describe('Assets endpoints', () => {
    test('GET /assets responds with 200 and json array', async () => {
        prismaMock.asset.findMany.calledWith().mockResolvedValueOnce([]);

        const response = await request(app).get('/assets');
        expect(response.status).toBe(200);

        const data = response.body;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toEqual(0);
    });

    test('POST /assets with valid data responds with 201 and created asset', async () => {
        prismaMock.asset.create.calledWith(expect.any(Object) as any).mockResolvedValueOnce(fullAssetFromDb);

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

    test('PUT /assets/:id with valid data responds with 200 and updated asset', async () => {
        prismaMock.asset.findUnique.calledWith(expect.any(Object) as any).mockResolvedValueOnce(fullAssetFromDb);
        const updateData = {
            name: "circle",
            description: "Updated description"
        };

        prismaMock.asset.update.calledWith(expect.any(Object) as any).mockResolvedValueOnce({
            ...fullAssetFromDb,
            ...updateData,
            name: formatAssetName(updateData.name)
        });

        const response = await request(app)
            .put(`/assets/${fullAsset.id}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            ...fullAsset,
            ...updateData
        });
    });

    test('GET /assets/thumbnail/:id responds with 200 and image buffer', async () => {
        prismaMock.asset.create.calledWith(expect.any(Object) as any).mockResolvedValueOnce(fullAssetFromDb);
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
        prismaMock.asset.findUnique.calledWith(expect.any(Object) as any).mockResolvedValueOnce(fullAssetFromDb);
        prismaMock.asset.delete.calledWith(expect.any(Object) as any).mockResolvedValueOnce(fullAssetFromDb);

        const response = await request(app)
            .delete(`/assets/${fullAsset.id}`);

        expect(response.status).toBe(204);
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

        test('PUT /assets/:id with invalid id responds with 400', async () => {
            prismaMock.asset.findUnique.calledWith(expect.any(Object) as any).mockResolvedValueOnce(fullAssetFromDb);
            const updateData = {
                name: "Updated Asset"
            };

            const response = await request(app)
                .put('/assets/invalid-id')
                .send(updateData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'invalid id');
        });

        test('PUT /assets/:id with non-existent id responds with 404', async () => {
            prismaMock.asset.update.calledWith(expect.any(Object) as any).mockRejectedValue({ code: 'P2025' });

            const updateData = {
                name: "Updated Asset"
            };

            const response = await request(app)
                .put(`/assets/${crypto.randomUUID()}`)
                .send(updateData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'not found');
        });

        test('PUT /assets/:id with duplicate tags responds with 400', async () => {
            prismaMock.asset.findUnique.calledWith(expect.any(Object) as any).mockResolvedValueOnce(fullAssetFromDb);
            const updateData = {
                tags: ["duplicate", "duplicate"]
            };

            const response = await request(app)
                .put(`/assets/${fullAsset.id}`)
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
            prismaMock.asset.delete.calledWith(expect.any(Object) as any).mockRejectedValue({ code: 'P2025' });

            const response = await request(app)
                .delete(`/assets/${crypto.randomUUID()}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'not found');
        });
    });
});