// Script to update order status in Firebase
// This simulates real-time order tracking updates

import { ref, update } from "firebase/database"
import { database } from "../lib/firebase"

// Function to update order status
export async function updateOrderStatus(orderId, status) {
  const updates = {}
  const timestamp = new Date().toISOString()

  // Update the specific tracking status
  updates[`orders/${orderId}/tracking/${status}/status`] = true
  updates[`orders/${orderId}/tracking/${status}/timestamp`] = timestamp
  updates[`orders/${orderId}/status`] = status

  try {
    await update(ref(database), updates)
    console.log(`Order ${orderId} updated to ${status}`)
  } catch (error) {
    console.error("Error updating order status:", error)
  }
}

// Simulate order progression
export async function simulateOrderProgress(orderId) {
  const statuses = ["confirmed", "processing", "shipped", "delivered"]
  const delays = [0, 2000, 5000, 8000] // delays in milliseconds

  for (let i = 0; i < statuses.length; i++) {
    setTimeout(() => {
      updateOrderStatus(orderId, statuses[i])
    }, delays[i])
  }
}

// Example usage:
// simulateOrderProgress('order123')
