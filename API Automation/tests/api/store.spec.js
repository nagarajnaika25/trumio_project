const { test, expect } = require('@playwright/test');
const { orderData } = require('../../test-data/petData');

const baseURL = 'https://petstore.swagger.io/v2';

test.describe('Store API', () => {
  let order;

  test('Place an order for a pet (POST /store/order)', async ({ request }) => {
    try {
      // unique order id every run
      const orderId = Date.now();

      // Use any petId (Petstore accepts it even if pet not present)
      order = {
        id: orderId,
        petId: 1010,
        quantity: 1,
        shipDate: new Date().toISOString(),
        status: 'placed',
        complete: true
      };

      console.log(`[LOG] Placing order id: ${order.id}`);

      const response = await request.post(`${baseURL}/store/order`, {
        data: order
      });

      expect(response.status(), await response.text()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(order.id);
      expect(body.petId).toBe(order.petId);
      expect(body.status).toBe(order.status);

      console.log(`[LOG] Order placed successfully: ${body.id}`);
    } catch (e) {
      console.error('[ERROR] Place order failed:', e);
      throw e;
    }
  });

  test('Find purchase order by ID (GET /store/order/{id})', async ({ request }) => {
    console.log(`[LOG] Fetching order id: ${order.id}`);

    const response = await request.get(`${baseURL}/store/order/${order.id}`);
    expect(response.status(), await response.text()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(order.id);
    expect(body.petId).toBe(order.petId);
  });

  test('Delete purchase order (DELETE /store/order/{id})', async ({ request }) => {
    console.log(`[LOG] Deleting order id: ${order.id}`);

    const response = await request.delete(`${baseURL}/store/order/${order.id}`);
    expect(response.status(), await response.text()).toBe(200);

    const body = await response.json();
    // Typical response: { code, type, message }
    expect(String(body.message)).toBe(String(order.id));

    console.log(`[LOG] Order deleted: ${order.id}`);
  });

  test('Negative: Find order with invalid ID', async ({ request }) => {
    const invalidOrderId = 999999999;

    console.log(`[LOG] Negative test - Fetching invalid order id: ${invalidOrderId}`);

    const response = await request.get(`${baseURL}/store/order/${invalidOrderId}`);

    // Petstore usually returns 404 for invalid order id
    expect(response.status()).toBe(404);

    const text = await response.text();
    expect(text).toContain('Order not found');
  });
});