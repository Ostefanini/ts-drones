import * as z from "zod/v4";
import { writeFileSync } from 'node:fs';
import { createDocument } from "zod-openapi";
import { assetSchema, assetCreateSchema, tagSchema, assetUpdateSchema } from "@ts-drones/shared";

export const document = createDocument({
    openapi: '3.1.0',
    info: {
        title: 'TS Drones API',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:4000',
        }
    ],
    paths: {
        '/assets': {
            post: {
                requestBody: {
                    content: {
                        'application/json': {
                            schema: assetCreateSchema,
                        },
                    },
                },
                responses: {
                    '201': {
                        description: '201 Created',
                        content: {
                            'application/json': {
                                schema: assetSchema,
                            },
                        },
                    },
                    '400': {
                        description: '400 Bad Request',
                    }
                },
            },
            get: {
                requestParams: {
                    query: z.object({
                        tags: z.array(tagSchema).optional(),
                    }),
                },
                responses: {
                    '200': {
                        description: '200 OK',
                        content: {
                            'application/json': {
                                schema: z.array(assetSchema),
                            }
                        },
                    }
                },
            },
        },
        '/assets/{id}': {
            patch: {
                requestBody: {
                    content: {
                        'application/json': {
                            schema: assetUpdateSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: '200 OK',
                        content: {
                            'application/json': {
                                schema: assetSchema,
                            },
                        },
                    },
                    '400': {
                        description: '400 Bad Request',
                    },
                    '404': {
                        description: '404 Not Found',
                    }
                }
            },
            delete: {
                responses: {
                    '204': {
                        description: '204 No Content',
                    },
                    '404': {
                        description: '404 Not Found',
                    }
                },
            }
        },
        "/tags": {
            get: {
                responses: {
                    '200': {
                        description: '200 OK',
                        content: {
                            'application/json': {
                                schema: z.array(tagSchema),
                            }
                        },
                    }
                },
            }
        }
    }
})

writeFileSync('openapi.json', JSON.stringify(document, null, 2));

console.log('✅ openapi.json generated');