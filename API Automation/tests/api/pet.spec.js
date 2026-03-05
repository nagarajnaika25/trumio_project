const { test, expect } = require('@playwright/test');
const { createPetPayload, updatedPetPayload } = require('../../test-data/petData');

const baseURL = 'https://petstore.swagger.io/v2';

test.describe('Pet API', () => {
  let pet; // shared pet across tests

  test('Add a new pet (POST /pet)', async ({ request }) => {
    try {
      pet = createPetPayload(); // unique every run

      console.log(`[LOG] Creating pet with id: ${pet.id}`);

      const response = await request.post(`${baseURL}/pet`, { data: pet });
      expect(response.status(), await response.text()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(pet.id);
      expect(body.name).toBe(pet.name);
      expect(body.status).toBe(pet.status);

      console.log(`[LOG] Pet created successfully: ${body.id}`);
    } catch (err) {
      console.error('[ERROR] Add new pet failed:', err);
      throw err;
    }
  });

  test('Find pet by ID (GET /pet/{id})', async ({ request }) => {
    try {
      console.log(`[LOG] Fetching pet by id: ${pet.id}`);

      const response = await request.get(`${baseURL}/pet/${pet.id}`);
      expect(response.status(), await response.text()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(pet.id);
      expect(body.name).toBe(pet.name);

      console.log(`[LOG] Pet found: ${body.id}`);
    } catch (err) {
      console.error('[ERROR] Find pet by ID failed:', err);
      throw err;
    }
  });

  test('Update an existing pet (PUT /pet)', async ({ request }) => {
    try {
      const updated = updatedPetPayload(pet);

      console.log(`[LOG] Updating pet id: ${updated.id} -> name: ${updated.name}`);

      const response = await request.put(`${baseURL}/pet`, { data: updated });
      expect(response.status(), await response.text()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(updated.id);
      expect(body.name).toBe(updated.name);

      pet = updated;

      console.log(`[LOG] Pet updated successfully: ${body.id}`);
    } catch (err) {
      console.error('[ERROR] Update pet failed:', err);
      throw err;
    }
  });

  test('Delete pet (DELETE /pet/{id})', async ({ request }) => {
    try {
      console.log(`[LOG] Deleting pet id: ${pet.id}`);

      const response = await request.delete(`${baseURL}/pet/${pet.id}`);
      expect(response.status(), await response.text()).toBe(200);

      const body = await response.json();
      expect(String(body.message)).toBe(String(pet.id));

      console.log(`[LOG] Pet deleted successfully: ${pet.id}`);
    } catch (err) {
      console.error('[ERROR] Delete pet failed:', err);
      throw err;
    }
  });

  test('Negative: Find pet with invalid ID (GET /pet/{invalidId})', async ({ request }) => {
    const invalidId = 999999999;

    console.log(`[LOG] Negative test - Fetching invalid pet id: ${invalidId}`);

    const response = await request.get(`${baseURL}/pet/${invalidId}`);
    expect(response.status()).toBe(404);

    const text = await response.text();
    expect(text).toContain('Pet not found');
  });
});